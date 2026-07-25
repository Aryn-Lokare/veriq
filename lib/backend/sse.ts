/**
 * lib/backend/sse.ts
 *
 * Server-Sent Events (SSE) encoding utilities.
 *
 * SSE wire format (per spec):
 *   event: EVENT_TYPE\n
 *   data: {"key":"value"}\n
 *   \n
 *
 * Usage in a ReadableStream controller:
 *   controller.enqueue(encodeSSEEvent('AGENT_EVENT', payload));
 */

import type { SSEEventType } from './constants';
import type {
  SSEAgentEventPayload,
  SSECompletePayload,
  SSEErrorPayload,
} from './types';

// Shared encoder — reused across all enqueue calls
const encoder = new TextEncoder();

// ── Core Encoder ──────────────────────────────────────────────────────────────

/**
 * Encodes a typed SSE event into a Uint8Array ready to enqueue into a ReadableStream.
 *
 * @param type  - SSE event type string (e.g., 'AGENT_EVENT')
 * @param data  - JSON-serializable payload
 */
export function encodeSSEEvent(type: SSEEventType, data: unknown): Uint8Array {
  const line = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  return encoder.encode(line);
}

/**
 * Encodes an SSE heartbeat comment to keep the connection alive.
 * SSE comments start with `:` and are ignored by EventSource clients.
 */
export function encodeSSEHeartbeat(): Uint8Array {
  return encoder.encode(': heartbeat\n\n');
}

// ── Typed Event Builders ──────────────────────────────────────────────────────

/**
 * Encodes an AGENT_EVENT — fired for each agent log during graph execution.
 */
export function encodeAgentEvent(payload: SSEAgentEventPayload): Uint8Array {
  return encodeSSEEvent('AGENT_EVENT', payload);
}

/**
 * Encodes a COMPLETE event — fired once when the graph finishes successfully.
 */
export function encodeCompleteEvent(payload: SSECompletePayload): Uint8Array {
  return encodeSSEEvent('COMPLETE', payload);
}

/**
 * Encodes an ERROR event — fired when the graph fails.
 */
export function encodeErrorEvent(payload: SSEErrorPayload): Uint8Array {
  return encodeSSEEvent('ERROR', payload);
}

// ── SSE Response Headers ──────────────────────────────────────────────────────

/**
 * Returns the standard headers required for an SSE response.
 * X-Accel-Buffering: no — required to disable Nginx response buffering.
 */
export function getSSEHeaders(): Record<string, string> {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  };
}
