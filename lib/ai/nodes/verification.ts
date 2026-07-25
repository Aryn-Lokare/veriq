import { ResearchState } from "../state";
import { Claim } from "../types";
import { ModelService } from "../services/model";
import { VERIFICATION_SPECIALIST_PROMPT } from "../prompts/verification";
import { parseSafeJson, truncateText } from "../utils";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/** Maximum source context length for the verification prompt. */
const MAX_SOURCE_CONTEXT_LENGTH = 10000;

/** Shape of a single verification result from the LLM. */
interface VerificationResult {
  claimId: string;
  status: "verified" | "mixed" | "unsupported";
  explanation: string;
}

/**
 * Verification Specialist Node
 *
 * Verifies every claim against the collected sources.
 * Batches ALL claims into a single LLM call for efficiency.
 * Returns verified / mixed / unsupported for each claim.
 */
export async function verificationSpecialistNode(
  state: ResearchState
): Promise<Partial<ResearchState>> {
  console.log("[Node] verificationSpecialist — Starting");
  console.log(
    `[Node] verificationSpecialist — Verifying ${state.claims.length} claims against ${state.sources.length} sources`
  );

  if (state.claims.length === 0) {
    console.warn("[Node] verificationSpecialist — No claims to verify");
    return {
      claims: [],
      status: "claims_verified",
    };
  }

  const model = ModelService.getModel("versatile", 0.1);

  // ── Build source context ─────────────────────────────────────────
  const sourceBlocks = state.sources.map((source, i) => {
    const snippet = truncateText(source.snippet, 1200);
    const tag = source.isGovAcad ? " [GOV/ACADEMIC]" : "";
    return `### Source ${i + 1} (${source.id}): ${source.title}${tag}\nURL: ${source.url}\nReliability: ${source.reliabilityScore ?? "N/A"}/100\n\n${snippet}`;
  });

  const sourceContext = truncateText(
    sourceBlocks.join("\n\n---\n\n"),
    MAX_SOURCE_CONTEXT_LENGTH
  );

  // ── Build claims list ────────────────────────────────────────────
  const claimsList = state.claims
    .map((c) => `- [${c.id}]: "${c.claimText}"`)
    .join("\n");

  const userMessage = `--- CLAIMS TO VERIFY ---
${claimsList}

--- SOURCE EVIDENCE ---
${sourceContext}

Verify every claim above against the source evidence. Output a JSON array with one object per claim.`;

  const response = await model.invoke([
    new SystemMessage(VERIFICATION_SPECIALIST_PROMPT),
    new HumanMessage(userMessage),
  ]);

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  const results = parseSafeJson<VerificationResult[]>(content, []);

  // ── Merge results back into claims ───────────────────────────────
  const resultMap = new Map<string, VerificationResult>();
  for (const r of results) {
    resultMap.set(r.claimId, r);
  }

  const verifiedClaims: Claim[] = state.claims.map((claim): Claim => {
    const result = resultMap.get(claim.id);
    if (result) {
      return {
        ...claim,
        status: result.status,
        explanation: result.explanation,
      };
    }
    // If the LLM missed a claim, mark it as unsupported
    return {
      ...claim,
      status: "unsupported",
      explanation: "No verification result returned by the specialist.",
    };
  });

  const verified = verifiedClaims.filter((c) => c.status === "verified").length;
  const mixed = verifiedClaims.filter((c) => c.status === "mixed").length;
  const unsupported = verifiedClaims.filter((c) => c.status === "unsupported").length;

  console.log(
    `[Node] verificationSpecialist — Results: ${verified} verified, ${mixed} mixed, ${unsupported} unsupported`
  );

  return {
    claims: verifiedClaims,
    status: "claims_verified",
  };
}
