/**
 * lib/backend/errors.ts
 *
 * Custom error hierarchy for the backend layer.
 * Every error class carries an HTTP status code so API route handlers
 * can convert them to Response objects without any switch statements.
 */

import { HTTP_STATUS } from './constants';

// ── Base Application Error ────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public readonly code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
    };
  }
}

// ── Specific Error Sub-classes ────────────────────────────────────────────────

export class ValidationError extends AppError {
  constructor(message: string, public readonly field?: string) {
    super(message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      ...(this.field ? { field: this.field } : {}),
    };
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, HTTP_STATUS.UNAUTHORIZED, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have access to this resource') {
    super(message, HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.CONFLICT, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

// ── Error Guard ───────────────────────────────────────────────────────────────

/**
 * Determines if an unknown thrown value is one of our AppErrors.
 */
export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

/**
 * Converts any caught error into an AppError.
 * Used in route handlers to ensure consistent error shape.
 */
export function toAppError(err: unknown): AppError {
  if (isAppError(err)) return err;
  if (err instanceof Error) {
    return new AppError(err.message);
  }
  return new AppError('An unexpected error occurred');
}
