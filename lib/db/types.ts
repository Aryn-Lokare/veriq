/**
 * lib/db/types.ts
 *
 * TypeScript types that mirror the Supabase PostgreSQL schema exactly.
 * - Column names are snake_case to match the database.
 * - These are used ONLY inside the repository layer.
 * - API layer uses DTOs defined in lib/backend/types.ts (camelCase).
 */

// ── Database Row Types ────────────────────────────────────────────────────────

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResearchSessionRow {
  id: string;
  session_id: string;
  user_id: string;
  question: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  retry_count: number;
  research_objectives: string[] | null;
  research_notes: string | null;
  confidence_score: number | null;
  confidence_reasoning: ConfidenceReasoningJson | null;
  final_report: string | null;
  is_bookmarked: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface SourceRow {
  id: string;
  ai_source_id: string;
  session_id: string;
  title: string;
  url: string;
  snippet: string | null;
  reliability_score: number | null;
  is_gov_acad: boolean;
  created_at: string;
}

export interface ClaimRow {
  id: string;
  ai_claim_id: string;
  session_id: string;
  claim_text: string;
  status: 'verified' | 'mixed' | 'unsupported' | null;
  explanation: string | null;
  confidence_score: number | null;
  created_at: string;
}

export interface ContradictionRow {
  id: string;
  session_id: string;
  ai_claim_id: string;
  ai_source_id: string;
  contradiction_text: string;
  explanation: string;
  created_at: string;
}

export interface AgentLogRow {
  id: string;
  session_id: string;
  agent_name: string;
  status: 'waiting' | 'running' | 'completed' | 'failed';
  message: string;
  output_data: Record<string, unknown> | null;
  duration_ms: number | null;
  created_at: string;
}

// ── JSON Sub-types ────────────────────────────────────────────────────────────

export interface ConfidenceReasoningJson {
  score: number;
  reason: string;
  supportingFactors: string[];
  detractingFactors: string[];
}

// ── Insert Payloads ───────────────────────────────────────────────────────────

export type NewResearchSession = Pick<
  ResearchSessionRow,
  'session_id' | 'user_id' | 'question'
>;

export type NewSourceRow = Omit<SourceRow, 'id' | 'created_at'>;

export type NewClaimRow = Omit<ClaimRow, 'id' | 'created_at'>;

export type NewContradictionRow = Omit<ContradictionRow, 'id' | 'created_at'>;

export type NewAgentLogRow = Omit<AgentLogRow, 'id' | 'created_at'>;

export interface CompleteSessionPayload {
  status: 'completed' | 'failed';
  retry_count: number;
  research_objectives: string[] | null;
  research_notes: string | null;
  confidence_score: number | null;
  confidence_reasoning: ConfidenceReasoningJson | null;
  final_report: string | null;
}
