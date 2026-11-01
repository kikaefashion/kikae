import type { z } from 'zod';

import { env } from '@/config/env';

import { ApiError } from './errors';
import { clearSession, getAuthToken } from './identity';

const DEFAULT_TIMEOUT_MS = 15_000;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  base: 'api' | 'auth';
  path: string;
  method?: HttpMethod;
  body?: unknown;
  /** Inject the Bearer token (from `identity.ts`). */
  auth?: boolean;
  /** Abort signal (e.g. React Query unmount). */
  signal?: AbortSignal;
  timeoutMs?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractMessage(value: unknown): string {
  if (isRecord(value) && typeof value.message === 'string') {
    return value.message;
  }
  if (isRecord(value) && typeof value.errors === 'string') {
    return value.errors;
  }
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  return 'Request failed';
}

function extractFieldErrors(value: unknown): Record<string, string[]> {
  if (!isRecord(value) || !isRecord(value.errors)) {
    return {};
  }
  const fieldErrors: Record<string, string[]> = {};
  for (const [field, messages] of Object.entries(value.errors)) {
    fieldErrors[field] = Array.isArray(messages)
      ? messages.map(String)
      : [String(messages)];
  }
  return fieldErrors;
}

function isFailureFlag(value: unknown): boolean {
  return value === false || value === 0 || value === '0';
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', onExternalAbort);
    }
  }

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (signal?.aborted) {
      throw error; // caller cancelled (React Query treats this as cancellation)
    }
    if (controller.signal.aborted) {
      throw new ApiError('timeout', `Request timed out after ${timeoutMs}ms`);
    }
    throw new ApiError(
      'network',
      error instanceof Error ? error.message : 'Network error',
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onExternalAbort);
  }
}

/** Low-level request: returns the parsed JSON body after HTTP error handling. */
export async function request(options: RequestOptions): Promise<unknown> {
  const {
    base,
    path,
    method = 'GET',
    body,
    auth = false,
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const url = `${base === 'auth' ? env.authBaseUrl : env.apiBaseUrl}${path}`;
  const response = await fetchWithTimeout(
    url,
    {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    },
    timeoutMs,
    signal,
  );

  const text = await response.text();
  let json: unknown = null;
  if (text.length > 0) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }

  if (response.status === 401) {
    clearSession(); // signal sign-out; Sanctum tokens do not refresh
    throw new ApiError(
      'unauthorized',
      'Your session has expired. Please sign in again.',
      {
        status: 401,
        body: json,
      },
    );
  }

  if (response.status === 422) {
    throw new ApiError('validation', extractMessage(json), {
      status: 422,
      fieldErrors: extractFieldErrors(json),
      body: json,
    });
  }

  if (!response.ok) {
    throw new ApiError('http', extractMessage(json), {
      status: response.status,
      body: json,
    });
  }

  return json;
}

/**
 * Parses a `Controller::responder` envelope (`{ status, message, data }`) or a
 * raw object, treating `status === false` / `success === false` as an error
 * even on HTTP 200, then validates `data` with the endpoint schema.
 */
export async function requestData<T>(
  options: RequestOptions & { dataSchema: z.ZodType<T> },
): Promise<T> {
  const json = await request(options);

  if (!isRecord(json)) {
    throw new ApiError('parse', 'Response body was not a JSON object');
  }

  if (isFailureFlag(json.status) || isFailureFlag(json.success)) {
    throw new ApiError('api', extractMessage(json.message ?? json.error));
  }

  const data = 'data' in json ? json.data : json;
  const parsed = options.dataSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError(
      'parse',
      'Response data did not match the expected shape',
    );
  }

  return parsed.data;
}
