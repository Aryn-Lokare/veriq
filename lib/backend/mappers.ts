/**
 * lib/backend/mappers.ts
 *
 * Pure transformation functions: DB row types → API DTOs.
 * No Supabase imports. No business logic. No side effects.
 */

import type {
  ResearchSessionRow,
  SourceRow,
  ClaimRow,
  ContradictionRow,
  AgentLogRow,
} from '@/lib/db/types';
import type {
  SessionSummaryDTO,
  ResearchSessionDetailDTO,
  SourceDTO,
  ClaimDTO,
  ContradictionDTO,
  AgentLogDTO,
  ConfidenceReasoningDTO,
} from './types';
import type { SessionStatus, ClaimStatus, AgentStatus } from './constants';

// ── Session Mappers ───────────────────────────────────────────────────────────

export function mapSessionToSummary(row: ResearchSessionRow): SessionSummaryDTO {
  return {
    id: row.id,
    sessionId: row.session_id,
    question: row.question,
    status: row.status as SessionStatus,
    confidenceScore: row.confidence_score,
    isBookmarked: row.is_bookmarked,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

export function mapSessionToDetail(row: ResearchSessionRow): ResearchSessionDetailDTO {
  let confidenceReasoning: ConfidenceReasoningDTO | null = null;

  if (row.confidence_reasoning) {
    confidenceReasoning = {
      score: row.confidence_reasoning.score,
      reason: row.confidence_reasoning.reason,
      supportingFactors: row.confidence_reasoning.supportingFactors ?? [],
      detractingFactors: row.confidence_reasoning.detractingFactors ?? [],
    };
  }

  return {
    id: row.id,
    sessionId: row.session_id,
    question: row.question,
    status: row.status as SessionStatus,
    retryCount: row.retry_count,
    researchObjectives: row.research_objectives ?? [],
    researchNotes: row.research_notes,
    confidenceScore: row.confidence_score,
    confidenceReasoning,
    finalReport: row.final_report,
    isBookmarked: row.is_bookmarked,
    isPublic: row.is_public,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}

// ── Source Mapper ─────────────────────────────────────────────────────────────

export function mapSource(row: SourceRow): SourceDTO {
  return {
    id: row.id,
    aiSourceId: row.ai_source_id,
    title: row.title,
    url: row.url,
    snippet: row.snippet,
    reliabilityScore: row.reliability_score,
    isGovAcad: row.is_gov_acad,
  };
}

export function mapSources(rows: SourceRow[]): SourceDTO[] {
  return rows.map(mapSource);
}

// ── Claim Mapper ──────────────────────────────────────────────────────────────

export function mapClaim(row: ClaimRow): ClaimDTO {
  return {
    id: row.id,
    aiClaimId: row.ai_claim_id,
    claimText: row.claim_text,
    status: (row.status as ClaimStatus) ?? null,
    explanation: row.explanation,
    confidenceScore: row.confidence_score,
  };
}

export function mapClaims(rows: ClaimRow[]): ClaimDTO[] {
  return rows.map(mapClaim);
}

// ── Contradiction Mapper ──────────────────────────────────────────────────────

export function mapContradiction(row: ContradictionRow): ContradictionDTO {
  return {
    id: row.id,
    aiClaimId: row.ai_claim_id,
    aiSourceId: row.ai_source_id,
    contradictionText: row.contradiction_text,
    explanation: row.explanation,
  };
}

export function mapContradictions(rows: ContradictionRow[]): ContradictionDTO[] {
  return rows.map(mapContradiction);
}

// ── Agent Log Mapper ──────────────────────────────────────────────────────────

export function mapAgentLog(row: AgentLogRow): AgentLogDTO {
  return {
    id: row.id,
    agentName: row.agent_name,
    status: row.status as AgentStatus,
    message: row.message,
    outputData: row.output_data,
    durationMs: row.duration_ms,
    createdAt: row.created_at,
  };
}

export function mapAgentLogs(rows: AgentLogRow[]): AgentLogDTO[] {
  return rows.map(mapAgentLog);
}
