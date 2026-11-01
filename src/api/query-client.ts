import { QueryClient } from '@tanstack/react-query';

import { isRetryableApiError } from './errors';

/** App-wide QueryClient defaults: no retry on 4xx/parse/validation. */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) =>
          isRetryableApiError(error) ? failureCount < 3 : false,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      },
    },
  });
}
