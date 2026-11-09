import { z } from 'zod';

import { request } from '../client';
import { ApiError } from '../errors';
import { bool, id, money } from '../helpers';

/**
 * `GET /getProduct/{id}` (public) — returns `{ status, message, data }` with the
 * product detail. Declares only the fields the screen renders so the private
 * store-owner data the backend embeds (owner email, phone, OTP `code`,
 * password-like `hash`, `balance`, `addresses`) never reaches state, logs or
 * tests. `status !== "approved"` renders the not-available state.
 */

const LikeSchema = z.object({
  user_id: id,
  like: z.union([z.boolean(), z.number()]),
});

export const ProductDetailSchema = z.object({
  id,
  name: z.string(),
  price: money,
  old_price: money.nullable(),
  status: z.string(),
  units: z.coerce.number().int().nonnegative(),
  thrift: bool.nullable(),
  description: z.string().nullable().optional().default(''),
  media: z
    .array(z.object({ url: z.string().nullable() }))
    .optional()
    .default([]),
  sizes: z
    .array(z.object({ size: z.string() }))
    .optional()
    .default([]),
  colours: z
    .array(z.object({ name: z.string() }))
    .optional()
    .default([]),
  ratings: z
    .array(z.object({ rating: z.coerce.number() }))
    .optional()
    .default([]),
  store: z.object({ id, name: z.string(), logo: z.string().nullable() }),
  likes: z.array(LikeSchema).optional().default([]),
  isMakeup: bool.optional().default(false),
  offer: z.string().nullable().optional(),
  coverages: z
    .array(z.object({ area: z.string(), fee: money }))
    .optional()
    .default([]),
  availability: z
    .array(z.object({ dated: z.string(), available: bool }))
    .optional()
    .default([]),
});

export type ProductDetail = z.infer<typeof ProductDetailSchema>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Returns the parsed product, or `null` when it does not exist — HTTP 404,
 * `status`/`success` false, or an empty `data` all mean "not found".
 */
export async function fetchProduct(
  productId: string | number,
  signal?: AbortSignal,
): Promise<ProductDetail | null> {
  let json: unknown;
  try {
    json = await request({
      base: 'api',
      path: `/getProduct/${productId}`,
      auth: false,
      signal,
    });
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.kind === 'http' &&
      error.status === 404
    ) {
      return null;
    }
    throw error;
  }

  if (!isRecord(json)) return null;
  if (json.status === false || json.success === false) return null;
  const data = 'data' in json ? json.data : json;
  if (data == null) return null;

  const parsed = ProductDetailSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError(
      'parse',
      'Response data did not match the expected shape',
    );
  }
  return parsed.data;
}

/** Fire-and-forget view tracking; errors are ignored by design (no retry). */
export async function trackProductView(
  productId: string | number,
): Promise<void> {
  try {
    await request({
      base: 'api',
      path: `/products/${productId}/views`,
      method: 'POST',
      auth: false,
    });
  } catch {
    // Ignored — a view is best-effort analytics, never a user-facing failure.
  }
}
