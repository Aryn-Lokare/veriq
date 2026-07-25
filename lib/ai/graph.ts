import { StateGraph, START, END } from "@langchain/langgraph";
import { ResearchStateAnnotation, ResearchState } from "./state";
import { Claim, Contradiction } from "./types";
import { calculateConfidence } from "./utils";

// ── Implemented Node Imports ───────────────────────────────────────
import { researchStrategistNode } from "./nodes/strategist";
import { searchSpecialistNode } from "./nodes/searcher";
import { researchAnalystNode } from "./nodes/analyst";

// ── Stub Nodes (not yet implemented) ───────────────────────────────

async function evidenceAnalystNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Node] evidenceAnalyst — STUB");
  const dummyClaims: Claim[] = [
    { id: "claim-stub-1", claimText: "Placeholder claim from stub." },
  ];
  return {
    claims: dummyClaims,
    status: "evidence_extracted",
  };
}

async function verificationSpecialistNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Node] verificationSpecialist — STUB");
  const verifiedClaims: Claim[] = state.claims.map((claim) => ({
    ...claim,
    status: "unsupported" as const,
    explanation: "Stub — verification not yet implemented.",
    confidenceScore: 0,
  }));
  return {
    claims: verifiedClaims,
    status: "claims_verified",
  };
}

async function contradictionDetectorNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Node] contradictionDetector — STUB");
  const dummyContradictions: Contradiction[] = [];
  return {
    contradictions: dummyContradictions,
    status: "contradictions_checked",
  };
}

async function confidenceScorerNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Node] confidenceScorer — STUB");
  const score = calculateConfidence(state.sources, state.claims, state.contradictions);
  return {
    confidenceScore: score,
    status: "confidence_scored",
  };
}

async function reportWriterNode(state: ResearchState): Promise<Partial<ResearchState>> {
  console.log("[Node] reportWriter — STUB");
  const report = `# Veriq Research Report: ${state.question}\n\n## Status\nReport generation not yet implemented.\n\n## Research Notes\n${state.researchNotes}\n\n## Confidence Score: ${state.confidenceScore}%`;
  return {
    finalReport: report,
    status: "completed",
  };
}

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

const workflow = new StateGraph(ResearchStateAnnotation)
  // Implemented nodes
  .addNode("strategist", researchStrategistNode)
  .addNode("searcher", searchSpecialistNode)
  .addNode("analyst", researchAnalystNode)

  // Stub nodes
  .addNode("evidenceAnalyst", evidenceAnalystNode)
  .addNode("verifier", verificationSpecialistNode)
  .addNode("contradiction", contradictionDetectorNode)
  .addNode("scorer", confidenceScorerNode)
  .addNode("writer", reportWriterNode)

  // Sequential flow
  .addEdge(START, "strategist")
  .addEdge("strategist", "searcher")
  .addEdge("searcher", "analyst")
  .addEdge("analyst", "evidenceAnalyst")
  .addEdge("evidenceAnalyst", "verifier")
  .addEdge("evidenceAnalyst", "contradiction")
  .addEdge("verifier", "scorer")
  .addEdge("contradiction", "scorer")

  // Conditional retry loop
  .addConditionalEdges("scorer", shouldRetry, {
    strategist: "strategist",
    writer: "writer",
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
