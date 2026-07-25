/**
 * lib/db/repository.ts
 *
 * Repository Pattern — all Supabase database interactions live here.
 *
 * Rules:
 * - No business logic. Pure data access only.
 * - Accepts a SupabaseClient so it inherits the caller's auth context (RLS).
 * - Throws DatabaseError on unexpected failures (caller must handle).
 * - All bulk inserts use ON CONFLICT DO NOTHING for idempotency across retries.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  ResearchSessionRow,
  SourceRow,
  ClaimRow,
  ContradictionRow,
  AgentLogRow,
  NewResearchSession,
  NewSourceRow,
  NewClaimRow,
  NewContradictionRow,
  NewAgentLogRow,
  CompleteSessionPayload,
} from './types';
import { Source, Claim, Contradiction } from '@/lib/ai/types';

// ── Errors ────────────────────────────────────────────────────────────────────

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// ── Repository Class ──────────────────────────────────────────────────────────

export class ResearchRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  // ── Sessions ──────────────────────────────────────────────────────────────

  /**
   * Insert a new research session row with status='idle'.
   * Returns the created session row.
   */
  async createSession(payload: NewResearchSession): Promise<ResearchSessionRow> {
    const { data, error } = await this.supabase
      .from('research_sessions')
      .insert({
        session_id: payload.session_id,
        user_id: payload.user_id,
        question: payload.question,
        status: 'idle',
      })
      .select()
      .single();

    if (error) {
      throw new DatabaseError(
        `Failed to create research session: ${error.message}`,
        error.code,
        error
      );
    }

    return data as ResearchSessionRow;
  }

  /**
   * Fetch a single session by its string session_id, scoped to a user.
   * Returns null if not found or not owned by user.
   */
  async getSessionBySessionId(
    sessionId: string,
    userId: string
  ): Promise<ResearchSessionRow | null> {
    const { data, error } = await this.supabase
      .from('research_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new DatabaseError(
        `Failed to fetch session: ${error.message}`,
        error.code,
        error
      );
    }

    return data as ResearchSessionRow | null;
  }

  /**
   * List all sessions for a user, ordered by creation date descending.
   */
  async listSessionsByUser(userId: string): Promise<ResearchSessionRow[]> {
    const { data, error } = await this.supabase
      .from('research_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new DatabaseError(
        `Failed to list sessions: ${error.message}`,
        error.code,
        error
      );
    }

    return (data ?? []) as ResearchSessionRow[];
  }

  /**
   * Update the status of a session (e.g., idle → running).
   */
  async updateSessionStatus(
    sessionId: string,
    status: 'idle' | 'running' | 'completed' | 'failed'
  ): Promise<void> {
    const { error } = await this.supabase
      .from('research_sessions')
      .update({ status })
      .eq('session_id', sessionId);

    if (error) {
      throw new DatabaseError(
        `Failed to update session status: ${error.message}`,
        error.code,
        error
      );
    }
  }

  /**
   * Write final AI state into the session row and set status to 'completed' or 'failed'.
   * Triggers the completed_at trigger in the database.
   */
  async completeSession(
    sessionId: string,
    payload: CompleteSessionPayload
  ): Promise<void> {
    const { error } = await this.supabase
      .from('research_sessions')
      .update({
        status: payload.status,
        retry_count: payload.retry_count,
        research_objectives: payload.research_objectives,
        research_notes: payload.research_notes,
        confidence_score: payload.confidence_score,
        confidence_reasoning: payload.confidence_reasoning,
        final_report: payload.final_report,
      })
      .eq('session_id', sessionId);

    if (error) {
      throw new DatabaseError(
        `Failed to complete session: ${error.message}`,
        error.code,
        error
      );
    }
  }

  /**
   * Delete a session (and all child data via CASCADE) by session_id + user_id.
   * Returns true if a row was deleted, false if not found.
   */
  async deleteSession(sessionId: string, userId: string): Promise<boolean> {
    const { error, count } = await this.supabase
      .from('research_sessions')
      .delete({ count: 'exact' })
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) {
      throw new DatabaseError(
        `Failed to delete session: ${error.message}`,
        error.code,
        error
      );
    }

    return (count ?? 0) > 0;
  }

  // ── Sources ───────────────────────────────────────────────────────────────

  /**
   * Bulk insert sources for a session.
   * ON CONFLICT DO NOTHING guards against duplicate inserts during retries.
   */
  async bulkInsertSources(
    sources: Source[],
    sessionId: string
  ): Promise<void> {
    if (sources.length === 0) return;

    const rows: NewSourceRow[] = sources.map((s) => ({
      ai_source_id: s.id,
      session_id: sessionId,
      title: s.title,
      url: s.url,
      snippet: s.snippet ?? null,
      reliability_score: s.reliabilityScore ?? null,
      is_gov_acad: s.isGovAcad ?? false,
    }));

    const { error } = await this.supabase
      .from('sources')
      .upsert(rows, {
        onConflict: 'session_id,ai_source_id',
        ignoreDuplicates: true,
      });

    if (error) {
      throw new DatabaseError(
        `Failed to insert sources: ${error.message}`,
        error.code,
        error
      );
    }
  }

  /**
   * Fetch all sources for a given session.
   */
  async getSourcesBySession(sessionId: string): Promise<SourceRow[]> {
    const { data, error } = await this.supabase
      .from('sources')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new DatabaseError(
        `Failed to fetch sources: ${error.message}`,
        error.code,
        error
      );
    }

    return (data ?? []) as SourceRow[];
  }

  // ── Claims ────────────────────────────────────────────────────────────────

  /**
   * Bulk insert claims for a session.
   * ON CONFLICT DO NOTHING via upsert + ignoreDuplicates.
   */
  async bulkInsertClaims(
    claims: Claim[],
    sessionId: string
  ): Promise<void> {
    if (claims.length === 0) return;

    const rows: NewClaimRow[] = claims.map((c) => ({
      ai_claim_id: c.id,
      session_id: sessionId,
      claim_text: c.claimText,
      status: c.status ?? null,
      explanation: c.explanation ?? null,
      confidence_score: c.confidenceScore ?? null,
    }));

    const { error } = await this.supabase
      .from('claims')
      .upsert(rows, {
        onConflict: 'session_id,ai_claim_id',
        ignoreDuplicates: true,
      });

    if (error) {
      throw new DatabaseError(
        `Failed to insert claims: ${error.message}`,
        error.code,
        error
      );
    }
  }

  /**
   * Fetch all claims for a given session.
   */
  async getClaimsBySession(sessionId: string): Promise<ClaimRow[]> {
    const { data, error } = await this.supabase
      .from('claims')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new DatabaseError(
        `Failed to fetch claims: ${error.message}`,
        error.code,
        error
      );
    }

    return (data ?? []) as ClaimRow[];
  }

  // ── Contradictions ────────────────────────────────────────────────────────

  /**
   * Bulk insert contradictions for a session.
   */
  async bulkInsertContradictions(
    contradictions: Contradiction[],
    sessionId: string
  ): Promise<void> {
    if (contradictions.length === 0) return;

    const rows: NewContradictionRow[] = contradictions.map((c) => ({
      session_id: sessionId,
      ai_claim_id: c.claimId,
      ai_source_id: c.sourceId,
      contradiction_text: c.contradictionText,
      explanation: c.explanation,
    }));

    const { error } = await this.supabase.from('contradictions').insert(rows);

    if (error) {
      throw new DatabaseError(
        `Failed to insert contradictions: ${error.message}`,
        error.code,
        error
      );
    }
  }

  /**
   * Fetch all contradictions for a given session.
   */
  async getContradictionsBySession(sessionId: string): Promise<ContradictionRow[]> {
    const { data, error } = await this.supabase
      .from('contradictions')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new DatabaseError(
        `Failed to fetch contradictions: ${error.message}`,
        error.code,
        error
      );
    }

    return (data ?? []) as ContradictionRow[];
  }

  // ── Agent Logs ────────────────────────────────────────────────────────────

  /**
   * Insert a single agent log event.
   * Called in real-time from the onAgentEvent callback during graph execution.
   * Failures are swallowed deliberately — log write errors must not crash the graph.
   */
  async insertAgentLog(row: NewAgentLogRow): Promise<void> {
    const { error } = await this.supabase.from('agent_logs').insert({
      session_id: row.session_id,
      agent_name: row.agent_name,
      status: row.status,
      message: row.message,
      output_data: row.output_data ?? null,
      duration_ms: row.duration_ms ?? null,
    });

    if (error) {
      // Log errors must not interrupt graph execution
      console.error('[Repository] insertAgentLog failed silently:', error.message);
    }
  }

  /**
   * Fetch all agent logs for a session in chronological order.
   */
  async getAgentLogsBySession(sessionId: string): Promise<AgentLogRow[]> {
    const { data, error } = await this.supabase
      .from('agent_logs')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new DatabaseError(
        `Failed to fetch agent logs: ${error.message}`,
        error.code,
        error
      );
    }

    return (data ?? []) as AgentLogRow[];
  }
}
