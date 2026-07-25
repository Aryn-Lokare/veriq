/**
 * app/api/research/[sessionId]/stream/route.ts
 *
 * GET /api/research/[sessionId]/stream
 *
 * Server-Sent Events (SSE) endpoint.
 *
 * Responsibilities:
 *  1. Authenticate the user.
 *  2. Verify the session exists and belongs to the user.
 *  3. Guard against re-running a session that is already running or completed.
 *  4. Open a ReadableStream and return it as an SSE response.
 *  5. Inside the stream: call executeResearch() from the service layer.
 *     - executeResearch() runs the AI graph, persists results, and calls
 *       sseWriter for every AgentEvent.
 *  6. Close the stream when the graph finishes (success or failure).
 *
 * Client-side usage:
 *   const es = new EventSource('/api/research/<sessionId>/stream');
 *   es.addEventListener('AGENT_EVENT', (e) => { ... });
 *   es.addEventListener('COMPLETE', (e) => { es.close(); fetchReport(); });
 *   es.addEventListener('ERROR', (e) => { es.close(); showError(); });
 *
 * Notes:
 *  - `export const maxDuration = 60` extends the Vercel function timeout to 60s.
 *    Adjust this if your research pipeline regularly exceeds 60 seconds.
 *  - If the client disconnects mid-run, the graph continues executing in Node.js
 *    and persists results to Supabase. The client can poll GET /api/research/[sessionId]
 *    to retrieve the completed report.
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ResearchRepository } from '@/lib/db/repository';
import { executeResearch } from '@/lib/services/research.service';
import { validateSessionId } from '@/lib/backend/validation';
import { getSSEHeaders } from '@/lib/backend/sse';
import { handleError, unauthorized, notFound } from '@/lib/backend/responses';
import { SESSION_STATUS } from '@/lib/backend/constants';

export const dynamic = 'force-dynamic';
// Extend serverless function timeout (adjust for your deployment)
export const maxDuration = 60;

// ── GET /api/research/[sessionId]/stream ──────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<Response> {
  // ── Input Validation ────────────────────────────────────────────────────────
  const { sessionId: rawSessionId } = await params;

  const validation = validateSessionId(rawSessionId);
  if (!validation.success) {
    return handleError(validation.error, 'GET /api/research/[sessionId]/stream');
  }
  const sessionId = validation.data;

  // ── Auth ────────────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return unauthorized();
  }

  // ── Session Ownership Check ─────────────────────────────────────────────────
  const repo = new ResearchRepository(supabase);
  const sessionRow = await repo.getSessionBySessionId(sessionId, user.id);

  if (!sessionRow) {
    return notFound('Research session');
  }

  // ── Guard: Prevent re-running terminal sessions ─────────────────────────────
  // A completed or failed session cannot be re-streamed.
  // The client should POST /api/research to create a new session instead.
  if (
    sessionRow.status === SESSION_STATUS.COMPLETED ||
    sessionRow.status === SESSION_STATUS.FAILED
  ) {
    return Response.json(
      {
        error: `Session is already in terminal status: ${sessionRow.status}. Create a new session to re-research.`,
        code: 'SESSION_ALREADY_TERMINAL',
      },
      { status: 409 }
    );
  }

  // ── Guard: Prevent concurrent duplicate stream connections ──────────────────
  // If status is already 'running', another stream connection is active.
  if (sessionRow.status === SESSION_STATUS.RUNNING) {
    return Response.json(
      {
        error: 'Session is already running. Only one active stream per session is allowed.',
        code: 'SESSION_ALREADY_RUNNING',
      },
      { status: 409 }
    );
  }

  const { question } = sessionRow;

  // ── SSE Stream ──────────────────────────────────────────────────────────────
  const stream = new ReadableStream({
    async start(controller) {
      /**
       * sseWriter — passed to executeResearch as the SSE output channel.
       * Wraps controller.enqueue() in a try/catch because the client
       * may disconnect at any point; the graph must continue to completion.
       */
      const sseWriter = (chunk: Uint8Array): void => {
        try {
          controller.enqueue(chunk);
        } catch {
          // Client disconnected — ignore, graph continues in background
        }
      };

      try {
        await executeResearch(supabase, sessionId, question, sseWriter);
      } catch (err) {
        // Error already logged + persisted in executeResearch.
        // The ERROR SSE event has already been sent.
        // Close the stream cleanly.
        console.error(
          `[StreamRoute] Session ${sessionId} terminated with error:`,
          err instanceof Error ? err.message : err
        );
      } finally {
        try {
          controller.close();
        } catch {
          // Controller may already be closed if client disconnected
        }
      }
    },
  });

  return new Response(stream, {
    headers: getSSEHeaders(),
  });
}
