import { ResearchState } from "../state";
import { Claim } from "../types";
import { ModelService } from "../services/model";
import { EVIDENCE_ANALYST_PROMPT } from "../prompts/evidence";
import { parseSafeJson, truncateText, executeNodeStep } from "../utils";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";

/** Maximum research notes length to feed into the LLM. */
const MAX_NOTES_LENGTH = 10000;

/**
 * Evidence Analyst Node
 *
 * Converts structured research notes into atomic, verifiable claims.
 * Uses the instant LLM for fast extraction.
 */
export async function evidenceAnalystNode(
  state: ResearchState,
  config?: RunnableConfig
): Promise<Partial<ResearchState>> {
  return executeNodeStep(
    "Evidence Analyst",
    "Extracting atomic, testable claims from research notes",
    state,
    config,
    async () => {
      if (!state.researchNotes || state.researchNotes.trim().length === 0) {
        console.warn("[Node] evidenceAnalyst — No research notes available");
        return {
          claims: [],
          status: "evidence_extracted",
        };
      }

      const model = ModelService.getModel("instant", 0.1);
      const truncatedNotes = truncateText(state.researchNotes, MAX_NOTES_LENGTH);

      const userMessage = `Research Question: "${state.question}"

--- BEGIN RESEARCH NOTES ---

${truncatedNotes}

--- END RESEARCH NOTES ---

Extract all atomic, independently verifiable factual claims from these research notes. Output a JSON array of strings.`;

      const response = await model.invoke([
        new SystemMessage(EVIDENCE_ANALYST_PROMPT),
        new HumanMessage(userMessage),
      ]);

      const content =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);

      const claimTexts = parseSafeJson<string[]>(content, []);

      if (claimTexts.length === 0) {
        console.warn("[Node] evidenceAnalyst — Failed to extract claims");
        return {
          claims: [],
          status: "evidence_extracted",
        };
      }

      const claims: Claim[] = claimTexts.map(
        (text, index): Claim => ({
          id: `claim-${index}`,
          claimText: text,
        })
      );

      return {
        claims,
        status: "evidence_extracted",
      };
    }
  );
}
