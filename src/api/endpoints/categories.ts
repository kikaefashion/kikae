import { z } from 'zod';

import { requestData } from '../client';
import { id } from '../helpers';

/**
 * `/v2/categories` (GET, public) — returns
 * `{ status, message, data: ProductCategory[] }`. Categories also eager-load
 * `subcategories → productTypes`; those are passed through and UNVERIFIED.
 */
export const ProductCategorySchema = z
  .object({
    id,
    name: z.string(),
    description: z.string().nullable().optional(),
  })
  .passthrough();

export const ProductCategoryListSchema = z.array(ProductCategorySchema);

export type ProductCategory = z.infer<typeof ProductCategorySchema>;

export function fetchCategories(
  signal?: AbortSignal,
): Promise<ProductCategory[]> {
  return requestData({
    base: 'api',
    path: '/v2/categories',
    auth: false,
    signal,
    dataSchema: ProductCategoryListSchema,
  });
}
