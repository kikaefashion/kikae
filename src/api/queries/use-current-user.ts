import { useQuery } from '@tanstack/react-query';

import { fetchCurrentUser } from '@/api/endpoints/current-user';
import { queryKeys } from '@/api/query-keys';

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: ({ signal }) => fetchCurrentUser(signal),
  });
}
