/**
 * lib/backend/constants.ts
 *
 * Shared constants for the backend layer.
 * Single source of truth — never hardcode these values in API routes or services.
 */

// ── Research Session Status Values ────────────────────────────────────────────

export const SESSION_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type SessionStatus = (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];

// ── Claim Verification Statuses ───────────────────────────────────────────────

export const CLAIM_STATUS = {
  VERIFIED: 'verified',
  MIXED: 'mixed',
  UNSUPPORTED: 'unsupported',
} as const;

export type ClaimStatus = (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];

// ── Agent Event Statuses ──────────────────────────────────────────────────────

export const AGENT_STATUS = {
  WAITING: 'waiting',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type AgentStatus = (typeof AGENT_STATUS)[keyof typeof AGENT_STATUS];

// ── SSE Event Types ───────────────────────────────────────────────────────────

export const SSE_EVENT_TYPE = {
  AGENT_EVENT: 'AGENT_EVENT',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR',
  HEARTBEAT: 'HEARTBEAT',
} as const;

export type SSEEventType = (typeof SSE_EVENT_TYPE)[keyof typeof SSE_EVENT_TYPE];

// ── Agent Names (as emitted by executeNodeStep) ───────────────────────────────

export const AGENT_NAMES = {
  STRATEGIST: 'Research Strategist',
  SEARCHER: 'Search Specialist',
  ANALYST: 'Research Analyst',
  EVIDENCE: 'Evidence Analyst',
  VERIFIER: 'Verification Specialist',
  CONTRADICTION: 'Contradiction Detector',
  SCORER: 'Confidence Scorer',
  WRITER: 'Report Writer',
} as const;

// ── Validation Limits ─────────────────────────────────────────────────────────

export const VALIDATION = {
  QUESTION_MIN_LENGTH: 10,
  QUESTION_MAX_LENGTH: 1000,
} as const;

// ── HTTP Status Codes ─────────────────────────────────────────────────────────

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
