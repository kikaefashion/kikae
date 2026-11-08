import { useQuery } from '@tanstack/react-query';

import { fetchBanners, sortBanners } from '@/api/endpoints/banners';
import { queryKeys } from '@/api/query-keys';

/** Banners change rarely — keep them fresh for at least 30 minutes. */
const BANNERS_STALE_TIME = 1000 * 60 * 30; // 30 min

export function useBanners() {
  return useQuery({
    queryKey: queryKeys.banners,
    queryFn: ({ signal }) => fetchBanners(signal),
    staleTime: BANNERS_STALE_TIME,
    select: sortBanners,
  });
}
