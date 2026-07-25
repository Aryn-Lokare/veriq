import { ResearchState } from "../state";
import { ModelService } from "../services/model";
import { REPORT_WRITER_PROMPT } from "../prompts/writer";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/**
 * Report Writer Node
 *
 * Compiles all verified outputs, source list, contradictions,
 * and confidence metrics into a polished markdown report.
 */
export async function reportWriterNode(
  state: ResearchState
): Promise<Partial<ResearchState>> {
  console.log("[Node] reportWriter — Starting");

  const model = ModelService.getModel("versatile", 0.2);

  // Format claims for report compilation input
  const claimsText = state.claims
    .map((c) => `- Claim [${c.id}]: "${c.claimText}"\n  Status: ${c.status || "unverified"}\n  Explanation: ${c.explanation || "No explanation provided."}`)
    .join("\n\n");

  // Format contradictions for report compilation input
  const contradictionsText = state.contradictions.length > 0
    ? state.contradictions
        .map((ct) => `- Contradiction on Claim [${ct.claimId}]:\n  Conflict: "${ct.contradictionText}"\n  Source ID: ${ct.sourceId}\n  Explanation: ${ct.explanation}`)
        .join("\n\n")
    : "No contradictions detected.";

  // Format sources for report compilation input
  const sourcesText = state.sources
    .map((s, i) => `${i + 1}. **${s.title}**\n   URL: ${s.url}\n   Reliability: ${s.reliabilityScore ?? 70}/100\n   Government/Academic: ${s.isGovAcad ? "Yes" : "No"}`)
    .join("\n\n");

  // Format confidence explanation details
  const scoreReasoning = state.confidenceReasoning
    ? `Calculated Score: ${state.confidenceScore}%
Reasoning: ${state.confidenceReasoning.reason}
Supporting Factors:
${state.confidenceReasoning.supportingFactors.map((f) => `  - ${f}`).join("\n")}
Detracting Factors:
${state.confidenceReasoning.detractingFactors.map((f) => `  - ${f}`).join("\n")}`
    : `Calculated Score: ${state.confidenceScore}%`;

  const userMessage = `Research Question: "${state.question}"

--- CONFIDENCE SCORING DETAILS ---
${scoreReasoning}

--- VERIFIED CLAIMS ---
${claimsText}

--- DETECTED CONTRADICTIONS ---
${contradictionsText}

--- ANALYZED SOURCES ---
${sourcesText}

Please generate the final markdown research and fact-verification report.`;

  const response = await model.invoke([
    new SystemMessage(REPORT_WRITER_PROMPT),
    new HumanMessage(userMessage),
  ]);

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  console.log(`[Node] reportWriter — Final report compiled (${content.length} chars)`);

  return {
    finalReport: content,
    status: "completed",
  };
}
