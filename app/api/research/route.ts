/**
 * app/api/research/route.ts
 *
 * POST /api/research  — Create a new research session
 * GET  /api/research  — List all research sessions for the authenticated user
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ResearchRepository } from '@/lib/db/repository';
import { createResearchSession } from '@/lib/services/research.service';
import { validateCreateResearchBody } from '@/lib/backend/validation';
import { mapSessionToSummary } from '@/lib/backend/mappers';
import { handleError, unauthorized, created, ok } from '@/lib/backend/responses';
import type {
  CreateResearchResponse,
  ListResearchResponse,
} from '@/lib/backend/types';

// Force dynamic rendering — these routes depend on request cookies (Supabase auth)
export const dynamic = 'force-dynamic';

// ── POST /api/research ────────────────────────────────────────────────────────

/**
 * Creates a new research session.
 *
 * Request body: { question: string }
 *
 * Response 201:
 *   {
 *     sessionId: string,
 *     status: 'idle',
 *     streamUrl: string,
 *     createdAt: string
 *   }
 *
 * The client should immediately open an EventSource to `streamUrl`
 * to trigger graph execution and receive live agent events.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorized();
    }

    // ── Input Validation ────────────────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return unauthorized(); // Malformed JSON is treated as a bad request
    }

    const validation = validateCreateResearchBody(body);
    if (!validation.success) {
      return handleError(validation.error, 'POST /api/research');
    }

    const { question } = validation.data;

    // ── Generate Session ID ─────────────────────────────────────────────────
    const sessionId = crypto.randomUUID();

    // ── Persist Session Row ─────────────────────────────────────────────────
    const { session } = await createResearchSession(
      supabase,
      user.id,
      sessionId,
      question
    );

    // ── Build Stream URL ────────────────────────────────────────────────────
    const baseUrl = request.nextUrl.origin;
    const streamUrl = `${baseUrl}/api/research/${sessionId}/stream`;

    const responseBody: CreateResearchResponse = {
      sessionId: session.session_id,
      status: 'idle',
      streamUrl,
      createdAt: session.created_at,
    };

    return created(responseBody);
  } catch (err) {
    return handleError(err, 'POST /api/research');
  }
}

// ── GET /api/research ─────────────────────────────────────────────────────────

/**
 * Lists all research sessions for the authenticated user.
 * Ordered by creation date descending (most recent first).
 *
 * Response 200:
 *   {
 *     sessions: SessionSummaryDTO[],
 *     total: number
 *   }
 */
export async function GET(_request: NextRequest): Promise<Response> {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorized();
    }

    // ── Fetch Sessions ──────────────────────────────────────────────────────
    const repo = new ResearchRepository(supabase);
    const rows = await repo.listSessionsByUser(user.id);

    const sessions = rows.map(mapSessionToSummary);

    const responseBody: ListResearchResponse = {
      sessions,
      total: sessions.length,
    };

    return ok(responseBody);
  } catch (err) {
    return handleError(err, 'GET /api/research');
  }
}
