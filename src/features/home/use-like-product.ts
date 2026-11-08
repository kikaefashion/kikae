import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { HomeData } from '@/api/endpoints/home';
import { likeProduct } from '@/api/endpoints/like-product';
import { queryKeys } from '@/api/query-keys';
import { useToast } from '@/components/ui/toast';

import { addLike } from './selectors';

/**
 * Add-only wishlist save with an optimistic update of the `['home']` cache:
 * on success the heart stays saved; on failure the cache is rolled back and a
 * toast is shown. Disabled while in flight (see `ProductCard`).
 */
export function useLikeProduct(userId: string | number | null) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (productId: string | number) => likeProduct(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.home });
      const previous = queryClient.getQueryData<HomeData>(queryKeys.home);
      if (previous && userId != null) {
        queryClient.setQueryData<HomeData>(
          queryKeys.home,
          addLike(previous, productId, userId),
        );
      }
      return { previous };
    },
    onError: (_error, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.home, context.previous);
      }
      toast.error("Couldn't save to wishlist. Try again.");
    },
  });
}
