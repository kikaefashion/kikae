import { z } from 'zod';

import { requestData } from '../client';
import { id } from '../helpers';

/**
 * `/v2/categories` (GET, public) — returns
 * `{ status, message, data: ProductCategory[] }` with nested
 * `subcategories → productTypes`. Everything is keyed by `id` (names repeat
 * across parents, so never key by name).
 */

const ProductTypeSchema = z
  .object({
    id,
    name: z.string(),
  })
  .passthrough();

const ProductSubcategorySchema = z
  .object({
    id,
    name: z.string(),
    productTypes: z.array(ProductTypeSchema).optional().default([]),
  })
  .passthrough();

export const ProductCategorySchema = z.object({
  id,
  name: z.string(),
  description: z.string().nullable().optional(),
  subcategories: z.array(ProductSubcategorySchema).optional().default([]),
});

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
