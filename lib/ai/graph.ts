import { StateGraph, START, END } from "@langchain/langgraph";
import { ResearchStateAnnotation, ResearchState } from "./state";

// ── Implemented Node Imports ───────────────────────────────────────
import { researchStrategistNode } from "./nodes/strategist";
import { searchSpecialistNode } from "./nodes/searcher";
import { researchAnalystNode } from "./nodes/analyst";
import { evidenceAnalystNode } from "./nodes/evidence";
import { verificationSpecialistNode } from "./nodes/verification";
import { contradictionDetectorNode } from "./nodes/contradiction";

// ── Stub Nodes (not yet implemented) ───────────────────────────────

async function confidenceScorerNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Node] confidenceScorer — STUB");
  return {
    status: "confidence_scored",
  };
}

async function reportWriterNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Node] reportWriter — STUB");
  return {
    finalReport: "",
    status: "completed",
  };
}

// ── Conditional Routing (Autonomous Retry Logic) ───────────────────

function shouldRetry(state: ResearchState): "strategist" | "scorer" {
  console.log(
    `[Edge] shouldRetry — retryCount: ${state.retryCount}, sources: ${state.sources.length}`
  );

  if (state.sources.length < 3 && state.retryCount < 2) {
    console.log("[Edge] Routing back to Strategist for query expansion");
    return "strategist";
  }

  console.log("[Edge] Proceeding to Scorer (stub)");
  return "scorer";
}

// ── Compile Graph Workflow ─────────────────────────────────────────
//
// Flow:
//   START → strategist → searcher → analyst → evidenceAnalyst
//     → verifier    ─┐
//     → contradiction ─┤→ scorer (stub) → shouldRetry?
//                                            ├─ strategist (retry)
//                                            └─ writer (stub) → END

const workflow = new StateGraph(ResearchStateAnnotation)
  // Implemented nodes
  .addNode("strategist", researchStrategistNode)
  .addNode("searcher", searchSpecialistNode)
  .addNode("analyst", researchAnalystNode)
  .addNode("evidenceAnalyst", evidenceAnalystNode)
  .addNode("verifier", verificationSpecialistNode)
  .addNode("contradiction", contradictionDetectorNode)

  // Stub nodes
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

  // Fan-in: both converge at scorer
  .addEdge("verifier", "scorer")
  .addEdge("contradiction", "scorer")

  // Conditional retry loop
  .addConditionalEdges("scorer", shouldRetry, {
    strategist: "strategist",
    scorer: "writer",
  })
  .addEdge("writer", END);

export const graph = workflow.compile();

/**
 * Triggers the compiled LangGraph execution.
 */
export async function runResearchGraph(
  sessionId: string,
  question: string
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
    finalReport: "",
    status: "starting",
  };

  return await graph.invoke(initialState);
}
