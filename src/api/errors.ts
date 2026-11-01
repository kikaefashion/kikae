/**
 * API error model — a discriminated union keyed by `kind`.
 * No thrown strings; surface `message` (or `error`) to the UI, never parse
 * exception text (backend-findings.md — Frontend API-client rules E.3).
 */
export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'http'
  | 'api'
  | 'validation'
  | 'unauthorized'
  | 'parse';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly body?: unknown;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    kind: ApiErrorKind,
    message: string,
    extras?: {
      status?: number;
      body?: unknown;
      fieldErrors?: Record<string, string[]>;
    },
  ) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = extras?.status;
    this.body = extras?.body;
    this.fieldErrors = extras?.fieldErrors;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** True for status codes that a client should not automatically retry. */
export function isRetryableApiError(error: unknown): boolean {
  if (!isApiError(error)) {
    return true;
  }
  if (error.kind === 'network' || error.kind === 'timeout') {
    return true;
  }
  if (
    error.kind === 'http' &&
    error.status !== undefined &&
    error.status >= 500
  ) {
    return true;
  }
  return false;
}
