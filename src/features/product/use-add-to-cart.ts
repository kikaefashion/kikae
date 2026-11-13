import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addToCart, updateCart, type CartLine } from '@/api/endpoints/cart';
import { queryKeys } from '@/api/query-keys';
import { useToast } from '@/components/ui/toast';

import { planAddToCart } from './selectors';

export interface AddToCartVariables {
  product: { id: string | number; units: number };
  sizeId: string | number;
  colorId: string | number;
  units: number;
}

type AddToCartResult =
  | { status: 'full' }
  | { status: 'added'; settle: 'update'; line: CartLine }
  | { status: 'added'; settle: 'refetch' };

/**
 * Add-to-cart that merges a repeated product/size/colour into the existing line
 * through `updateCart` and clamps the quantity to stock (counting the SUM of
 * units across all lines of that product). `updateCart` settles the `['cart']`
 * cache from its response; a fresh line invalidates it (no line in the
 * `addToCart` response). Refuses nothing here — the screen never calls this for
 * makeup or freebies, and `planAddToCart` treats an exhausted product as `full`.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({
      product,
      sizeId,
      colorId,
      units,
    }: AddToCartVariables): Promise<AddToCartResult> => {
      const cart = queryClient.getQueryData<CartLine[]>(queryKeys.cart) ?? [];
      const plan = planAddToCart(cart, product, sizeId, colorId, units);
      if (plan.kind === 'full') return { status: 'full' };

      if (plan.kind === 'update') {
        const line = await updateCart(plan.lineId, plan.units, product.id);
        return { status: 'added', settle: 'update', line };
      }

      await addToCart({
        units: plan.units,
        productId: product.id,
        sizeId,
        colorId,
      });
      return { status: 'added', settle: 'refetch' };
    },
    onSuccess: (result) => {
      if (result.status === 'full') {
        toast.warning('No more of this item is available');
        return;
      }
      if (result.settle === 'update') {
        queryClient.setQueryData<CartLine[]>(queryKeys.cart, (current) =>
          (current ?? []).map((line) =>
            line.id === result.line.id ? result.line : line,
          ),
        );
      } else {
        void queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }
      toast.success('Added to cart', {
        action: { label: 'View cart', onPress: () => router.push('/cart') },
      });
    },
    onError: () => {
      toast.error("Couldn't add to cart. Try again.");
    },
  });
}