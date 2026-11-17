import { useQuery } from '@tanstack/react-query';

import { fetchCart } from '@/api/endpoints/cart';
import { queryKeys } from '@/api/query-keys';
import { capabilities } from '@/config/capabilities';
import { useSessionStatus, useUserId } from '@/session/session-store';

/** Long stale time: the cart is read lazily and the TopBar badge reuses it. */
const CART_STALE_TIME = 1000 * 60 * 5; // 5 min

/**
 * Signed-in cart query (`['cart']`); disabled for guests, until the user id
 * resolves, and while the cart is off — so it never posts `user_id: null`.
 */
export function useCart() {
  const signedIn = useSessionStatus() === 'signedIn';
  const userId = useUserId();
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: ({ signal }) => fetchCart(signal),
    enabled: signedIn && userId !== null && capabilities.cartEnabled,
    staleTime: CART_STALE_TIME,
  });
}
