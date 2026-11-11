import { z } from 'zod';

import { requestData } from '../client';
import { getUserId } from '../identity';

/**
 * `POST /likeProduct` (public) — add-only wishlist save. Copies the legacy
 * call's body `{ product_id, like: true, user_id }` exactly; the user id comes
 * from the identity module, never from the screen. There is no unlike route.
 */
export function likeProduct(
  productId: string | number,
  options?: { signal?: AbortSignal; timeoutMs?: number },
): Promise<unknown> {
  return requestData({
    base: 'api',
    path: '/likeProduct',
    method: 'POST',
    body: { product_id: productId, like: true, user_id: getUserId() },
    signal: options?.signal,
    timeoutMs: options?.timeoutMs,
    dataSchema: z.unknown(),
  });
}
