/**
 * lib/backend/responses.ts
 *
 * Typed HTTP response helpers.
 * Wraps Response.json() with consistent status codes and typing.
 * Eliminates hardcoded status numbers scattered across route handlers.
 */

import { HTTP_STATUS } from './constants';
import { isAppError, toAppError } from './errors';
import type { ApiErrorResponse } from './types';

// ── Success Responses ─────────────────────────────────────────────────────────

export function ok<T>(data: T): Response {
  return Response.json(data, { status: HTTP_STATUS.OK });
}

export function created<T>(data: T): Response {
  return Response.json(data, { status: HTTP_STATUS.CREATED });
}

// ── Error Responses ───────────────────────────────────────────────────────────

export function badRequest(message: string, field?: string): Response {
  const body: ApiErrorResponse = { error: message, code: 'VALIDATION_ERROR' };
  if (field) body.field = field;
  return Response.json(body, { status: HTTP_STATUS.BAD_REQUEST });
}

export function unauthorized(message = 'Authentication required'): Response {
  const body: ApiErrorResponse = { error: message, code: 'UNAUTHORIZED' };
  return Response.json(body, { status: HTTP_STATUS.UNAUTHORIZED });
}

export function forbidden(message = 'Access denied'): Response {
  const body: ApiErrorResponse = { error: message, code: 'FORBIDDEN' };
  return Response.json(body, { status: HTTP_STATUS.FORBIDDEN });
}

export function notFound(resource = 'Resource'): Response {
  const body: ApiErrorResponse = {
    error: `${resource} not found`,
    code: 'NOT_FOUND',
  };
  return Response.json(body, { status: HTTP_STATUS.NOT_FOUND });
}

export function conflict(message: string): Response {
  const body: ApiErrorResponse = { error: message, code: 'CONFLICT' };
  return Response.json(body, { status: HTTP_STATUS.CONFLICT });
}

export function serverError(message = 'Internal server error'): Response {
  const body: ApiErrorResponse = { error: message, code: 'INTERNAL_ERROR' };
  return Response.json(body, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
}

// ── Catch-All Error Handler ───────────────────────────────────────────────────

/**
 * Converts any caught error to the appropriate HTTP response.
 * Route handlers should call this in their catch blocks.
 *
 * @example
 * try {
 *   ...
 * } catch (err) {
 *   return handleError(err, 'POST /api/research');
 * }
 */
export function handleError(err: unknown, context: string): Response {
  const appErr = toAppError(err);

  // Always log unexpected errors server-side
  if (appErr.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    console.error(`[${context}] Unhandled error:`, err);
  } else {
    console.warn(`[${context}] Client error (${appErr.statusCode}):`, appErr.message);
  }

  if (isAppError(err)) {
    return Response.json(err.toJSON(), { status: err.statusCode });
  }

  return serverError();
}
