import { useQuery } from '@tanstack/react-query';

import { fetchCart } from '@/api/endpoints/cart';
import { queryKeys } from '@/api/query-keys';
import { useSessionStatus } from '@/session/session-store';

/** Long stale time: the cart is read lazily and the TopBar badge reuses it. */
const CART_STALE_TIME = 1000 * 60 * 5; // 5 min

/** Signed-in cart query (`['cart']`); disabled for guests. */
export function useCart() {
  const signedIn = useSessionStatus() === 'signedIn';
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: ({ signal }) => fetchCart(signal),
    enabled: signedIn,
    staleTime: CART_STALE_TIME,
  });
}