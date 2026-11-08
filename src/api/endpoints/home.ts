import { z } from 'zod';

import { requestData } from '../client';
import { bool, id, money } from '../helpers';

/**
 * `GET /customer/v2/home` (public) — returns `{ status, message, data }` with
 * the home feed sections. Only the sections below are consumed; other keys the
 * backend still serializes (sponsored, fashion_news, runway_videos) are
 * dropped, and every product is filtered to `status === "approved"`.
 *
 * Declares only the fields the app renders so the private store data the
 * backend embeds (owner email, phone, OTP `code`, password-like `hash`,
 * `balance`, `addresses`) never reaches state, logs or tests.
 */

const LikeSchema = z.object({
  user_id: id,
  like: z.union([z.boolean(), z.number()]),
});

const MediaSchema = z.object({
  url: z.string().nullable(),
});

const StoreSchema = z.object({
  id,
  name: z.string(),
  logo: z.string().nullable(),
});

const RatingSchema = z.object({
  rating: z.coerce.number(),
});

export const ProductSchema = z.object({
  id,
  name: z.string(),
  price: money,
  old_price: money.nullable(),
  status: z.string(),
  units: z.coerce.number().int().nonnegative(),
  thrift: bool.nullable(),
  made_in_nigeria: bool.optional(),
  ratings: z.array(RatingSchema).optional().default([]),
  store: StoreSchema,
  media: z.array(MediaSchema).optional().default([]),
  likes: z.array(LikeSchema).optional().default([]),
});

export type Product = z.infer<typeof ProductSchema>;

export const CategorySchema = z.object({
  id,
  name: z.string(),
  product_count: z.coerce.number().int().nonnegative(),
  total_views: z.coerce.number().int().nonnegative(),
  image: z.string().nullable(),
});

export type Category = z.infer<typeof CategorySchema>;

const approvedProducts = z
  .array(ProductSchema)
  .transform((products) =>
    products.filter((product) => product.status === 'approved'),
  );

export const HomeDataSchema = z.object({
  new_arrivals: approvedProducts,
  featured_products: approvedProducts,
  thrift_products: approvedProducts,
  freebies: approvedProducts,
  trending_categories: z.array(CategorySchema),
});

export type HomeData = z.infer<typeof HomeDataSchema>;

const HOME_LIMITS = {
  new_arrivals_limit: 12,
  featured_limit: 8,
  thrift_limit: 8,
  freebies_limit: 6,
  trending_limit: 8,
  sponsored_limit: 0,
  fashion_news_limit: 0,
  runway_videos_limit: 0,
} as const;

export function fetchHome(signal?: AbortSignal): Promise<HomeData> {
  const params = Object.entries(HOME_LIMITS)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return requestData({
    base: 'api',
    path: `/customer/v2/home?${params}`,
    auth: false,
    signal,
    dataSchema: HomeDataSchema,
  });
}
