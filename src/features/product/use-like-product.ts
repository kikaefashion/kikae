import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { HomeData } from '@/api/endpoints/home';
import type { ProductDetail } from '@/api/endpoints/product';
import { likeProduct } from '@/api/endpoints/like-product';
import { queryKeys } from '@/api/query-keys';
import { useToast } from '@/components/ui/toast';
import { addLike } from '@/features/home/selectors';

/**
 * Add-only wishlist save that optimistically updates BOTH the `['product', id]`
 * cache (so the heart stays saved here) and the `['home']` cache (so going back
 * to Home shows the saved state). Rolls back and toasts on failure.
 */
export function useLikeProduct(userId: string | number | null) {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (productId: string | number) => likeProduct(productId),
    onMutate: async (productId) => {
      if (userId == null) return;
      await queryClient.cancelQueries({
        queryKey: queryKeys.product(productId),
      });
      await queryClient.cancelQueries({ queryKey: queryKeys.home });

      const previousProduct = queryClient.getQueryData<ProductDetail>(
        queryKeys.product(productId),
      );
      const previousHome = queryClient.getQueryData<HomeData>(queryKeys.home);

      if (previousProduct) {
        queryClient.setQueryData<ProductDetail>(queryKeys.product(productId), {
          ...previousProduct,
          likes: [...previousProduct.likes, { user_id: userId, like: 1 }],
        });
      }
      if (previousHome) {
        queryClient.setQueryData<HomeData>(
          queryKeys.home,
          addLike(previousHome, productId, userId),
        );
      }
      return { previousProduct, previousHome };
    },
    onError: (_error, productId, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(
          queryKeys.product(productId),
          context.previousProduct,
        );
      }
      if (context?.previousHome) {
        queryClient.setQueryData(queryKeys.home, context.previousHome);
      }
      toast.error("Couldn't save to wishlist. Try again.");
    },
  });
}
