import { ResearchState } from "../state";
import { Contradiction } from "../types";
import { ModelService } from "../services/model";
import { CONTRADICTION_DETECTOR_PROMPT } from "../prompts/contradiction";
import { parseSafeJson, truncateText, executeNodeStep } from "../utils";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";

/** Maximum source context length for the contradiction prompt. */
const MAX_SOURCE_CONTEXT_LENGTH = 10000;

/** Shape of a single contradiction result from the LLM. */
interface ContradictionResult {
  claimId: string;
  contradictionText: string;
  sourceId: string;
  explanation: string;
}

/**
 * Contradiction Detector Node
 *
 * Adversarial agent that actively attempts to disprove every claim.
 * Runs independently from the Verification Specialist.
 * Returns any conflicting evidence found in the sources.
 */
export async function contradictionDetectorNode(
  state: ResearchState,
  config?: RunnableConfig
): Promise<Partial<ResearchState>> {
  return executeNodeStep(
    "Contradiction Detector",
    "Searching adversarial sources to detect conflicting data or claims",
    state,
    config,
    async () => {
      if (state.claims.length === 0) {
        console.warn("[Node] contradictionDetector — No claims to check");
        return {
          contradictions: [],
          status: "contradictions_checked",
        };
      }

      const model = ModelService.getModel("instant", 0.2);

      // ── Build source context ─────────────────────────────────────────
      const sourceBlocks = state.sources.map((source, i) => {
        const snippet = truncateText(source.snippet, 1200);
        const tag = source.isGovAcad ? " [GOV/ACADEMIC]" : "";
        return `### Source ${i + 1} (${source.id}): ${source.title}${tag}\nURL: ${source.url}\n\n${snippet}`;
      });

      const sourceContext = truncateText(
        sourceBlocks.join("\n\n---\n\n"),
        MAX_SOURCE_CONTEXT_LENGTH
      );

      // ── Build claims list ────────────────────────────────────────────
      const claimsList = state.claims
        .map((c) => `- [${c.id}]: "${c.claimText}"`)
        .join("\n");

      const userMessage = `--- CLAIMS TO DISPROVE ---
${claimsList}

--- SOURCE EVIDENCE ---
${sourceContext}

For every claim above, actively search the source evidence for anything that contradicts, conflicts with, or undermines the claim. Output a JSON array of contradiction objects. Return an empty array [] if no contradictions are found.`;

      const response = await model.invoke([
        new SystemMessage(CONTRADICTION_DETECTOR_PROMPT),
        new HumanMessage(userMessage),
      ]);

      const content =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);

      const results = parseSafeJson<ContradictionResult[]>(content, []);

      const contradictions: Contradiction[] = results.map(
        (r): Contradiction => ({
          claimId: r.claimId,
          contradictionText: r.contradictionText || "",
          sourceId: r.sourceId || "",
          explanation: r.explanation || "",
        })
      );

      return {
        contradictions,
        status: "contradictions_checked",
      };
    }
  );
}
