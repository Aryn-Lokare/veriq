import { ResearchState } from "../state";
import { ModelService } from "../services/model";
import { RESEARCH_ANALYST_PROMPT } from "../prompts/analyst";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { truncateText } from "../utils";

/** Maximum total characters of source content to feed into the analyst prompt. */
const MAX_CONTEXT_LENGTH = 12000;

/**
 * Research Analyst Node
 *
 * Receives sources and the original question.
 * Uses the instant LLM to compile structured research notes.
 * Output: structured findings only — no conclusions or opinions.
 */
export async function researchAnalystNode(
  state: ResearchState
): Promise<Partial<ResearchState>> {
  console.log("[Node] researchAnalyst — Starting");
  console.log(
    `[Node] researchAnalyst — Processing ${state.sources.length} sources`
  );

  if (state.sources.length === 0) {
    console.warn("[Node] researchAnalyst — No sources available, skipping");
    return {
      researchNotes: "No sources were found during the search phase.",
      status: "analysis_completed",
    };
  }

  const model = ModelService.getModel("instant", 0.1);

  // ── Build context block from sources ─────────────────────────────
  const sourceBlocks = state.sources.map((source, index) => {
    const snippet = truncateText(source.snippet, 1500);
    const domainTag = source.isGovAcad ? " [GOV/ACADEMIC]" : "";
    return `### Source ${index + 1}: ${source.title}${domainTag}\nURL: ${source.url}\nReliability: ${source.reliabilityScore ?? "N/A"}/100\n\n${snippet}`;
  });

  const fullContext = truncateText(sourceBlocks.join("\n\n---\n\n"), MAX_CONTEXT_LENGTH);

  const userMessage = `Research Question: "${state.question}"

Research Objectives:
${state.researchObjectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}

--- BEGIN SEARCH RESULTS ---

${fullContext}

--- END SEARCH RESULTS ---

Compile structured research notes from the above sources. Include all relevant findings, statistics, and domain context. Reference source URLs for every finding.`;

  const response = await model.invoke([
    new SystemMessage(RESEARCH_ANALYST_PROMPT),
    new HumanMessage(userMessage),
  ]);

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  if (!content || content.trim().length === 0) {
    console.warn(
      "[Node] researchAnalyst — Empty response from LLM, returning fallback"
    );
    return {
      researchNotes: "The analyst was unable to produce research notes from the available sources.",
      status: "analysis_completed",
    };
  }

  console.log(
    `[Node] researchAnalyst — Generated ${content.length} chars of research notes`
  );

  return {
    researchNotes: content,
    status: "analysis_completed",
  };
}
