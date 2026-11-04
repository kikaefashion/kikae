import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { fetchHome } from '@/api/endpoints/home';
import { queryKeys } from '@/api/query-keys';

const HOME_STALE_TIME = 1000 * 60 * 5; // 5 min

export function useHome() {
  return useQuery({
    queryKey: queryKeys.home,
    queryFn: ({ signal }) => fetchHome(signal),
    staleTime: HOME_STALE_TIME,
    placeholderData: keepPreviousData,
  });
}
