/**
 * lib/backend/types.ts
 *
 * API Data Transfer Objects (DTOs) returned to the frontend.
 * - camelCase naming convention (matches TypeScript/JSON conventions).
 * - Derived from DB row types via mappers in lib/backend/mappers.ts.
 * - These are the contracts the frontend depends on.
 */

import type { SessionStatus, ClaimStatus, AgentStatus } from './constants';

// ── Response DTOs ─────────────────────────────────────────────────────────────

export interface SessionSummaryDTO {
  id: string;
  sessionId: string;
  question: string;
  status: SessionStatus;
  confidenceScore: number | null;
  isBookmarked: boolean;
  createdAt: string;
  completedAt: string | null;
}

export interface SourceDTO {
  id: string;
  aiSourceId: string;
  title: string;
  url: string;
  snippet: string | null;
  reliabilityScore: number | null;
  isGovAcad: boolean;
}

export interface ClaimDTO {
  id: string;
  aiClaimId: string;
  claimText: string;
  status: ClaimStatus | null;
  explanation: string | null;
  confidenceScore: number | null;
}

export interface ContradictionDTO {
  id: string;
  aiClaimId: string;
  aiSourceId: string;
  contradictionText: string;
  explanation: string;
}

export interface AgentLogDTO {
  id: string;
  agentName: string;
  status: AgentStatus;
  message: string;
  outputData: Record<string, unknown> | null;
  durationMs: number | null;
  createdAt: string;
}

export interface ConfidenceReasoningDTO {
  score: number;
  reason: string;
  supportingFactors: string[];
  detractingFactors: string[];
}

export interface ResearchSessionDetailDTO {
  id: string;
  sessionId: string;
  question: string;
  status: SessionStatus;
  retryCount: number;
  researchObjectives: string[];
  researchNotes: string | null;
  confidenceScore: number | null;
  confidenceReasoning: ConfidenceReasoningDTO | null;
  finalReport: string | null;
  isBookmarked: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

// ── API Request Bodies ────────────────────────────────────────────────────────

export interface CreateResearchRequestBody {
  question: string;
}

// ── API Response Envelopes ────────────────────────────────────────────────────

export interface CreateResearchResponse {
  sessionId: string;
  status: 'idle';
  streamUrl: string;
  createdAt: string;
}

export interface ListResearchResponse {
  sessions: SessionSummaryDTO[];
  total: number;
}

export interface GetResearchSessionResponse {
  session: ResearchSessionDetailDTO;
  sources: SourceDTO[];
  claims: ClaimDTO[];
  contradictions: ContradictionDTO[];
  agentLogs: AgentLogDTO[];
}

export interface DeleteResearchResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  field?: string;
}

// ── SSE Event Payloads ────────────────────────────────────────────────────────

export interface SSEAgentEventPayload {
  sessionId: string;
  agentName: string;
  status: AgentStatus;
  message: string;
  outputData?: Record<string, unknown>;
  durationMs?: number;
}

export interface SSECompletePayload {
  sessionId: string;
  status: 'completed';
}

export interface SSEErrorPayload {
  sessionId: string;
  status: 'failed';
  error: string;
}
