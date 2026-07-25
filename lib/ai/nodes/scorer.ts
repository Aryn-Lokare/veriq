import { ResearchState } from "../state";
import { ConfidenceReasoning } from "../types";
import { ModelService } from "../services/model";
import { CONFIDENCE_SCORER_PROMPT } from "../prompts/scorer";
import { calculateConfidence, parseSafeJson, truncateText } from "../utils";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/**
 * Confidence Scorer Node
 *
 * 1. Programmatically calculates the numeric confidence score.
 * 2. Uses the versatile LLM to generate structured reasoning explaining the score.
 */
export async function confidenceScorerNode(
  state: ResearchState
): Promise<Partial<ResearchState>> {
  console.log("[Node] confidenceScorer — Starting");

  // Calculate the score programmatically
  const score = calculateConfidence(state.sources, state.claims, state.contradictions);
  console.log(`[Node] confidenceScorer — Programmatic Score: ${score}%`);

  const model = ModelService.getModel("versatile", 0.1);

  // Build the list of claims with their verification status
  const claimsText = state.claims
    .map((c) => `- [${c.id}]: "${c.claimText}" (Status: ${c.status || "unverified"}, Reason: ${c.explanation || "N/A"})`)
    .join("\n");

  // Build the list of contradictions
  const contradictionsText = state.contradictions.length > 0
    ? state.contradictions
        .map((ct) => `- Contradiction on claim [${ct.claimId}]: "${ct.contradictionText}" (Source URL: ${state.sources.find(s => s.id === ct.sourceId)?.url || ct.sourceId})`)
        .join("\n")
    : "No contradictions found.";

  // Build the list of sources
  const sourcesText = state.sources
    .map((s) => `- [${s.reliabilityScore}/100] ${s.title} (${s.url}) [Gov/Acad: ${s.isGovAcad}]`)
    .join("\n");

  const userMessage = `Research Question: "${state.question}"
Calculated Score: ${score}%

--- ANALYZED SOURCES ---
${sourcesText}

--- VERIFIED CLAIMS ---
${claimsText}

--- DETECTED CONTRADICTIONS ---
${contradictionsText}

Generate the structured JSON reasoning for this score.`;

  const response = await model.invoke([
    new SystemMessage(CONFIDENCE_SCORER_PROMPT),
    new HumanMessage(userMessage),
  ]);

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  const reasoningResult = parseSafeJson<{
    reason: string;
    supportingFactors: string[];
    detractingFactors: string[];
  }>(content, {
    reason: `Confidence score of ${score}% assigned based on the analysis of ${state.sources.length} sources and ${state.claims.length} claims.`,
    supportingFactors: [],
    detractingFactors: [],
  });

  const confidenceReasoning: ConfidenceReasoning = {
    score,
    reason: reasoningResult.reason,
    supportingFactors: reasoningResult.supportingFactors || [],
    detractingFactors: reasoningResult.detractingFactors || [],
  };

  console.log("[Node] confidenceScorer — Explanation reasoning generated");

  return {
    confidenceScore: score,
    confidenceReasoning,
    status: "confidence_scored",
  };
}
