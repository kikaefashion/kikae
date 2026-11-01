import { useQuery } from '@tanstack/react-query';

import { fetchCategories } from '@/api/endpoints/categories';
import { queryKeys } from '@/api/query-keys';

/** The category tree changes rarely — keep it fresh for a long time. */
const CATEGORY_TREE_STALE_TIME = 1000 * 60 * 60 * 24; // 24h

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: ({ signal }) => fetchCategories(signal),
    staleTime: CATEGORY_TREE_STALE_TIME,
  });
}
