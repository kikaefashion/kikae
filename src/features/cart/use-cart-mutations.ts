import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  removeFromCart,
  updateCart,
  type CartLine,
} from '@/api/endpoints/cart';
import { queryKeys } from '@/api/query-keys';
import { useToast } from '@/components/ui/toast';

/**
 * Cart line mutations. `updateCart` settles the `['cart']` cache from its
 * response; `removeFromCart` removes the line locally (its response body is
 * UNVERIFIED, so we don't parse it).
 */
export function useCartMutations() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const update = useMutation({
    mutationFn: ({ line, units }: { line: CartLine; units: number }) =>
      updateCart(line.id, units, line.product.id),
    onSuccess: (updated) => {
      queryClient.setQueryData<CartLine[]>(queryKeys.cart, (current) =>
        (current ?? []).map((line) =>
          line.id === updated.id ? updated : line,
        ),
      );
    },
    onError: () => {
      toast.error("Couldn't update quantity. Try again.");
    },
  });

  const remove = useMutation({
    mutationFn: (line: CartLine) => removeFromCart(line.id),
    onSuccess: (_data, line) => {
      queryClient.setQueryData<CartLine[]>(queryKeys.cart, (current) =>
        (current ?? []).filter((entry) => entry.id !== line.id),
      );
      toast.success('Removed from cart');
    },
    onError: () => {
      toast.error("Couldn't remove item. Try again.");
    },
  });

  return { update, remove };
}
