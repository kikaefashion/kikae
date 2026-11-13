import { z } from 'zod';

import { request, requestData } from '../client';
import { bool, id, money } from '../helpers';
import { getUserId } from '../identity';

/** Coerces a missing or `null` list to `[]` — the backend nulls empty relations. */
function list<T extends z.ZodTypeAny>(item: T): z.ZodType<z.infer<T>[]> {
  return z.array(item).nullish().transform((value) => value ?? []);
}

/** Product embedded in each cart line — only the fields the app uses. */
const CartProductSchema = z.object({
  id,
  name: z.string(),
  price: money,
  old_price: money.nullable(),
  units: z.coerce.number().int().nonnegative(),
  status: z.string(),
  isMakeup: bool.optional().default(false),
  thrift: bool.nullable(),
  media: list(z.object({ url: z.string().nullable() })),
  sizes: list(z.object({ id, size: z.string() })),
  colours: list(z.object({ id, name: z.string() })),
});

/**
 * One `getCart` line. Declares only what the app reads; Zod strips the private
 * store-owner data the backend embeds under `product.shop` / `product.shop.user`
 * (owner email, phone, hash, balance, addresses), the line-level `user_id` /
 * `product_id`, and every custom-measurement field — so none of it reaches state.
 */
export const CartLineSchema = z.object({
  id,
  units: z.coerce.number().int().nonnegative(),
  size_id: id.nullable().optional(),
  color_id: id.nullable().optional(),
  isCustom: z.string(),
  available_id: id.nullable().optional(),
  product: CartProductSchema,
});

export type CartLine = z.infer<typeof CartLineSchema>;

/**
 * `POST /addToCart` (auth). A normal item sends exactly the legacy body —
 * `{units, product_id, size_id, color_id}` — with no measurement fields and no
 * `isCustom`. The response flag is `success`, not `status`.
 */
export function addToCart(input: {
  units: number;
  productId: string | number;
  sizeId: string | number;
  colorId: string | number;
}): Promise<unknown> {
  return requestData({
    base: 'api',
    path: '/addToCart',
    method: 'POST',
    auth: true,
    body: {
      units: input.units,
      product_id: input.productId,
      size_id: input.sizeId,
      color_id: input.colorId,
    },
    dataSchema: z.unknown(),
  });
}

/** `POST /getCart` — `{user_id}`; the id comes from the identity module. */
export function fetchCart(signal?: AbortSignal): Promise<CartLine[]> {
  return requestData({
    base: 'api',
    path: '/getCart',
    method: 'POST',
    body: { user_id: getUserId() },
    signal,
    dataSchema: z.array(CartLineSchema),
  });
}

/**
 * `POST /updateCart` — `{units, user_id, id, product_id}`. Returns the updated
 * line, which settles the `['cart']` cache without a `getCart` refetch.
 */
export function updateCart(
  id: string | number,
  units: number,
  productId: string | number,
): Promise<CartLine> {
  return requestData({
    base: 'api',
    path: '/updateCart',
    method: 'POST',
    body: { units, user_id: getUserId(), id, product_id: productId },
    dataSchema: CartLineSchema,
  });
}

/**
 * `POST /removeFromCart` — `{id}`. Response shape is UNVERIFIED, so the client
 * tolerates an empty or minimal body (transport errors still throw).
 */
export async function removeFromCart(id: string | number): Promise<void> {
  await request({
    base: 'api',
    path: '/removeFromCart',
    method: 'POST',
    body: { id },
  });
}