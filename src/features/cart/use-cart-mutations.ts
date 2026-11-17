import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  removeFromCart,
  updateCart,
  type CartLine,
  type CartResult,
} from '@/api/endpoints/cart';
import { queryKeys } from '@/api/query-keys';
import { useToast } from '@/components/ui/toast';

/**
 * Cart line mutations. `updateCart` settles the `['cart']` cache from its
 * response line; `removeFromCart` (whose response carries no line) invalidates
 * and refetches the cart instead.
 */
export function useCartMutations() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const update = useMutation({
    mutationFn: ({ line, units }: { line: CartLine; units: number }) =>
      updateCart(line.id, units, line.product.id),
    onSuccess: (updated) => {
      queryClient.setQueryData<CartResult>(queryKeys.cart, (current) => {
        const lines = (current?.lines ?? []).map((line) =>
          line.id === updated.id ? updated : line,
        );
        return { lines, failedCount: current?.failedCount ?? 0 };
      });
    },
    onError: () => {
      toast.error("Couldn't update quantity. Try again.");
    },
  });

  const remove = useMutation({
    mutationFn: (line: CartLine) => removeFromCart(line.id),
    onSuccess: () => {
      // The remove response carries no line, so the cache is re-read from the
      // backend rather than settled from a response body.
      void queryClient.invalidateQueries({
        queryKey: queryKeys.cart,
        refetchType: 'all',
      });
      toast.success('Removed from cart');
    },
    onError: () => {
      toast.error("Couldn't remove item. Try again.");
    },
  });

  return { update, remove };
}
