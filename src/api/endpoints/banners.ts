import { z } from 'zod';

import { requestData } from '../client';
import { id } from '../helpers';

/**
 * `GET /banners/all` (public) — returns `{ status, data: Banner[] }`. Declares
 * only the fields the carousel renders; `created_at`/`updated_at` are dropped.
 * The carousel orders by `position`.
 */

export const BannerSchema = z.object({
  id,
  title: z.string(),
  text: z.string(),
  file: z.string(),
  position: z.coerce.number().int().nonnegative(),
  url: z.string(),
});

export type Banner = z.infer<typeof BannerSchema>;

const BannerListSchema = z.array(BannerSchema);

export function fetchBanners(signal?: AbortSignal): Promise<Banner[]> {
  return requestData({
    base: 'api',
    path: '/banners/all',
    auth: false,
    signal,
    dataSchema: BannerListSchema,
  });
}

/** Stable ascending order by `position` (the API order is not guaranteed). */
export function sortBanners(banners: Banner[]): Banner[] {
  return [...banners].sort((a, b) => a.position - b.position);
}
