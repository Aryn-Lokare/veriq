/**
 * lib/backend/validation.ts
 *
 * Manual input validators — no external validation library required.
 * Each validator returns a typed result object instead of throwing,
 * so API routes can handle failures uniformly.
 */

import { VALIDATION } from './constants';
import { ValidationError } from './errors';

// ── Validator Result ──────────────────────────────────────────────────────────

export interface ValidationResult<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  error: ValidationError;
}

export type ValidatorResult<T> = ValidationResult<T> | ValidationFailure;

// ── Request Body Types ────────────────────────────────────────────────────────

export interface ValidatedCreateResearchBody {
  question: string;
}

// ── Validators ────────────────────────────────────────────────────────────────

/**
 * Validates the POST /api/research request body.
 * Ensures `question` is a non-empty string within length bounds.
 */
export function validateCreateResearchBody(
  body: unknown
): ValidatorResult<ValidatedCreateResearchBody> {
  if (!body || typeof body !== 'object') {
    return {
      success: false,
      error: new ValidationError('Request body must be a JSON object'),
    };
  }

  const { question } = body as Record<string, unknown>;

  if (question === undefined || question === null) {
    return {
      success: false,
      error: new ValidationError('question is required', 'question'),
    };
  }

  if (typeof question !== 'string') {
    return {
      success: false,
      error: new ValidationError('question must be a string', 'question'),
    };
  }

  const trimmed = question.trim();

  if (trimmed.length < VALIDATION.QUESTION_MIN_LENGTH) {
    return {
      success: false,
      error: new ValidationError(
        `question must be at least ${VALIDATION.QUESTION_MIN_LENGTH} characters`,
        'question'
      ),
    };
  }

  if (trimmed.length > VALIDATION.QUESTION_MAX_LENGTH) {
    return {
      success: false,
      error: new ValidationError(
        `question must not exceed ${VALIDATION.QUESTION_MAX_LENGTH} characters`,
        'question'
      ),
    };
  }

  return {
    success: true,
    data: { question: trimmed },
  };
}

/**
 * Validates that a sessionId path parameter is a valid UUID v4.
 * This prevents path traversal / injection via dynamic route segments.
 */
export function validateSessionId(
  sessionId: unknown
): ValidatorResult<string> {
  if (typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    return {
      success: false,
      error: new ValidationError('sessionId must be a non-empty string', 'sessionId'),
    };
  }

  // UUID v4 regex
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!UUID_REGEX.test(sessionId.trim())) {
    return {
      success: false,
      error: new ValidationError('sessionId must be a valid UUID v4', 'sessionId'),
    };
  }

  return {
    success: true,
    data: sessionId.trim(),
  };
}
