import { ResearchState } from "../state";
import { ModelService } from "../services/model";
import { RESEARCH_STRATEGIST_PROMPT } from "../prompts/strategist";
import { parseSafeJson, executeNodeStep } from "../utils";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";

/**
 * Research Strategist Node
 *
 * Receives the user's question.
 * Uses the versatile LLM to decompose it into 3-5 search objectives.
 * Returns a JSON array of strings.
 */
export async function researchStrategistNode(
  state: ResearchState,
  config?: RunnableConfig
): Promise<Partial<ResearchState>> {
  return executeNodeStep(
    "Research Strategist",
    "Decomposing user research question into targeted search queries",
    state,
    config,
    async () => {
      const model = ModelService.getModel("versatile", 0.2);

      const retryContext =
        state.retryCount > 0
          ? `\n\nIMPORTANT: This is retry attempt ${state.retryCount}. The previous search only found ${state.sources.length} sources, which is insufficient. Generate DIFFERENT and BROADER search queries this time. Try alternative phrasings, related subtopics, or domain-specific terminology.`
          : "";

      const response = await model.invoke([
        new SystemMessage(RESEARCH_STRATEGIST_PROMPT),
        new HumanMessage(
          `Research question: "${state.question}"${retryContext}\n\nGenerate research objectives now.`
        ),
      ]);

      const content =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);

      const objectives = parseSafeJson<string[]>(content, []);

      if (objectives.length === 0) {
        console.warn(
          "[Node] researchStrategist — Failed to parse objectives, using fallback"
        );
        return {
          researchObjectives: [state.question],
          retryCount: state.retryCount + 1,
          status: "strategy_completed",
        };
      }

      return {
        researchObjectives: objectives,
        retryCount: state.retryCount + 1,
        status: "strategy_completed",
      };
    }
  );
}
