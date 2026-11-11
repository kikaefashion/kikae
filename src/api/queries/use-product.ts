import { useQuery } from '@tanstack/react-query';

import { fetchProduct } from '@/api/endpoints/product';
import { queryKeys } from '@/api/query-keys';

const PRODUCT_STALE_TIME = 1000 * 60 * 5; // 5 min

export function useProduct(id: string | number) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: ({ signal }) => fetchProduct(id, signal),
    staleTime: PRODUCT_STALE_TIME,
  });
}
