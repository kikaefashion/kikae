import { QueryClient } from '@tanstack/react-query';

import { ApiError, isRetryableApiError } from '../errors';
import { createQueryClient } from '../query-client';

describe('createQueryClient', () => {
  it('returns a QueryClient', () => {
    expect(createQueryClient()).toBeInstanceOf(QueryClient);
  });

  it('configures retry to skip 4xx/api/parse and cap retries at 3', () => {
    const client = createQueryClient();
    const retry = client.getDefaultOptions().queries?.retry as (
      failureCount: number,
      error: unknown,
    ) => boolean;

    expect(retry(1, new ApiError('http', 'x', { status: 500 }))).toBe(true);
    expect(retry(1, new ApiError('network', 'x'))).toBe(true);
    expect(retry(3, new ApiError('network', 'x'))).toBe(false);
    expect(retry(1, new ApiError('http', 'x', { status: 400 }))).toBe(false);
    expect(retry(1, new ApiError('api', 'x'))).toBe(false);
  });
});

describe('isRetryableApiError', () => {
  it('retries only network, timeout and 5xx', () => {
    expect(isRetryableApiError(new ApiError('network', 'x'))).toBe(true);
    expect(isRetryableApiError(new ApiError('timeout', 'x'))).toBe(true);
    expect(
      isRetryableApiError(new ApiError('http', 'x', { status: 500 })),
    ).toBe(true);
    expect(
      isRetryableApiError(new ApiError('http', 'x', { status: 400 })),
    ).toBe(false);
    expect(isRetryableApiError(new ApiError('api', 'x'))).toBe(false);
    expect(isRetryableApiError(new ApiError('validation', 'x'))).toBe(false);
    expect(isRetryableApiError(new ApiError('parse', 'x'))).toBe(false);
    expect(isRetryableApiError(new Error('plain'))).toBe(true);
  });
});
