import { useQuery } from '@tanstack/react-query';

import { fetchCategories } from '@/api/endpoints/categories';
import { queryKeys } from '@/api/query-keys';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: ({ signal }) => fetchCategories(signal),
  });
}
