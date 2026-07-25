/**
 * app/api/research/[sessionId]/route.ts
 *
 * GET    /api/research/[sessionId]  — Fetch full session detail
 * DELETE /api/research/[sessionId]  — Delete session and all child data
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ResearchRepository } from '@/lib/db/repository';
import {
  mapSessionToDetail,
  mapSources,
  mapClaims,
  mapContradictions,
  mapAgentLogs,
} from '@/lib/backend/mappers';
import { validateSessionId } from '@/lib/backend/validation';
import {
  handleError,
  unauthorized,
  notFound,
  ok,
} from '@/lib/backend/responses';
import type {
  GetResearchSessionResponse,
  DeleteResearchResponse,
} from '@/lib/backend/types';

export const dynamic = 'force-dynamic';

// ── GET /api/research/[sessionId] ─────────────────────────────────────────────

/**
 * Fetches the full research session payload including:
 * - Session details (status, report, confidence reasoning)
 * - Sources
 * - Claims
 * - Contradictions
 * - Agent logs (chronological)
 *
 * Response 200: GetResearchSessionResponse
 * Response 401: Not authenticated
 * Response 404: Session not found or not owned by user
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<Response> {
  try {
    const { sessionId: rawSessionId } = await params;

    // ── Input Validation ──────────────────────────────────────────────────
    const validation = validateSessionId(rawSessionId);
    if (!validation.success) {
      return handleError(validation.error, 'GET /api/research/[sessionId]');
    }
    const sessionId = validation.data;

    // ── Auth ──────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorized();
    }

    // ── Fetch Session + Children ──────────────────────────────────────────
    const repo = new ResearchRepository(supabase);

    const sessionRow = await repo.getSessionBySessionId(sessionId, user.id);
    if (!sessionRow) {
      return notFound('Research session');
    }

    // Fetch all child data in parallel for performance
    const [sourceRows, claimRows, contradictionRows, logRows] = await Promise.all([
      repo.getSourcesBySession(sessionId),
      repo.getClaimsBySession(sessionId),
      repo.getContradictionsBySession(sessionId),
      repo.getAgentLogsBySession(sessionId),
    ]);

    const responseBody: GetResearchSessionResponse = {
      session: mapSessionToDetail(sessionRow),
      sources: mapSources(sourceRows),
      claims: mapClaims(claimRows),
      contradictions: mapContradictions(contradictionRows),
      agentLogs: mapAgentLogs(logRows),
    };

    return ok(responseBody);
  } catch (err) {
    return handleError(err, 'GET /api/research/[sessionId]');
  }
}

// ── DELETE /api/research/[sessionId] ─────────────────────────────────────────

/**
 * Deletes a research session and all its child data (CASCADE).
 *
 * Response 200: { success: true, message: string }
 * Response 401: Not authenticated
 * Response 404: Session not found or not owned by user
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<Response> {
  try {
    const { sessionId: rawSessionId } = await params;

    // ── Input Validation ──────────────────────────────────────────────────
    const validation = validateSessionId(rawSessionId);
    if (!validation.success) {
      return handleError(validation.error, 'DELETE /api/research/[sessionId]');
    }
    const sessionId = validation.data;

    // ── Auth ──────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorized();
    }

    // ── Delete ────────────────────────────────────────────────────────────
    const repo = new ResearchRepository(supabase);
    const deleted = await repo.deleteSession(sessionId, user.id);

    if (!deleted) {
      return notFound('Research session');
    }

    const responseBody: DeleteResearchResponse = {
      success: true,
      message: `Research session ${sessionId} and all associated data deleted successfully.`,
    };

    return ok(responseBody);
  } catch (err) {
    return handleError(err, 'DELETE /api/research/[sessionId]');
  }
}
