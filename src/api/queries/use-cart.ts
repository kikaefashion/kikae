import { useQuery } from '@tanstack/react-query';

import { fetchCart } from '@/api/endpoints/cart';
import { queryKeys } from '@/api/query-keys';
import { capabilities } from '@/config/capabilities';
import { useSessionStatus } from '@/session/session-store';

/** Long stale time: the cart is read lazily and the TopBar badge reuses it. */
const CART_STALE_TIME = 1000 * 60 * 5; // 5 min

/** Signed-in cart query (`['cart']`); disabled for guests and while the cart is off. */
export function useCart() {
  const signedIn = useSessionStatus() === 'signedIn';
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: ({ signal }) => fetchCart(signal),
    enabled: signedIn && capabilities.cartEnabled,
    staleTime: CART_STALE_TIME,
  });
}
