import { StateGraph, START, END } from "@langchain/langgraph";
import { ResearchStateAnnotation, ResearchState } from "./state";
import { AgentEventCallback } from "./types";

// ── Implemented Node Imports ───────────────────────────────────────
import { researchStrategistNode } from "./nodes/strategist";
import { searchSpecialistNode } from "./nodes/searcher";
import { researchAnalystNode } from "./nodes/analyst";
import { evidenceAnalystNode } from "./nodes/evidence";
import { verificationSpecialistNode } from "./nodes/verification";
import { contradictionDetectorNode } from "./nodes/contradiction";
import { confidenceScorerNode } from "./nodes/scorer";
import { reportWriterNode } from "./nodes/writer";

// ── Conditional Routing (Autonomous Retry Logic) ───────────────────

function shouldRetry(state: ResearchState): "strategist" | "writer" {
  console.log(
    `[Edge] shouldRetry — retryCount: ${state.retryCount}, sources: ${state.sources.length}`
  );

  if (state.sources.length < 3 && state.retryCount < 2) {
    console.log("[Edge] Routing back to Strategist for query expansion");
    return "strategist";
  }

  console.log("[Edge] Proceeding to Report Writer");
  return "writer";
}

// ── Compile Graph Workflow ─────────────────────────────────────────
//
// Flow:
//   START → strategist → searcher → analyst → evidenceAnalyst
//     → verifier    ─┐
//     → contradiction ─┤→ scorer → shouldRetry?
//                                   ├─ strategist (retry)
//                                   └─ writer → END

const workflow = new StateGraph(ResearchStateAnnotation)
  // Register all nodes
  .addNode("strategist", researchStrategistNode)
  .addNode("searcher", searchSpecialistNode)
  .addNode("analyst", researchAnalystNode)
  .addNode("evidenceAnalyst", evidenceAnalystNode)
  .addNode("verifier", verificationSpecialistNode)
  .addNode("contradiction", contradictionDetectorNode)
  .addNode("scorer", confidenceScorerNode)
  .addNode("writer", reportWriterNode)

  // Sequential flow: START → strategist → searcher → analyst → evidenceAnalyst
  .addEdge(START, "strategist")
  .addEdge("strategist", "searcher")
  .addEdge("searcher", "analyst")
  .addEdge("analyst", "evidenceAnalyst")

  // Parallel fan-out: evidenceAnalyst → [verifier, contradiction]
  .addEdge("evidenceAnalyst", "verifier")
  .addEdge("evidenceAnalyst", "contradiction")

  // Fan-in: both parallel nodes converge at scorer
  .addEdge("verifier", "scorer")
  .addEdge("contradiction", "scorer")

  // Conditional retry check after scorer
  .addConditionalEdges("scorer", shouldRetry, {
    strategist: "strategist",
    writer: "writer",
  })
  .addEdge("writer", END);

export const graph = workflow.compile();

export interface RunGraphOptions {
  onAgentEvent?: AgentEventCallback;
}

/**
 * Triggers the compiled LangGraph execution.
 */
export async function runResearchGraph(
  sessionId: string,
  question: string,
  options?: RunGraphOptions
): Promise<ResearchState> {
  const initialState = {
    sessionId,
    question,
    retryCount: 0,
    researchObjectives: [],
    sources: [],
    researchNotes: "",
    claims: [],
    contradictions: [],
    confidenceScore: 50,
    confidenceReasoning: null,
    finalReport: "",
    status: "starting",
  };

  return await graph.invoke(initialState, {
    configurable: {
      onAgentEvent: options?.onAgentEvent,
    },
  });
}
