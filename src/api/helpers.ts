import { z } from 'zod';

/**
 * Zod helpers for the Kikae API (backend-findings.md — Frontend API-client rules).
 *
 * `bool` accepts `true/false`, `0/1` (int or string), and `null` — mapping
 * `0`/`"0"`/`null` to `false` and `1`/`"1"`/`true` to `true`.
 */
export const bool = z
  .union([
    z.boolean(),
    z.literal(0),
    z.literal(1),
    z.literal('0'),
    z.literal('1'),
    z.null(),
  ])
  .transform((value) => value === true || value === 1 || value === '1');

/** Money: `decimal(12,2)` columns arrive as strings, `float` columns as numbers. */
export const money = z
  .union([z.number(), z.string()])
  .transform((value) => Number(value))
  .refine((value) => Number.isFinite(value), {
    message: 'invalid money value',
  });

/** Ids: bigint auto-increment → number; `stores.id` / `products.store_id` → UUID string. */
export const id = z.union([z.number(), z.string()]);

/** Timestamps: accept both UTC `Z` and any ±HH:MM offset; keep the raw string. */
export const dateTime = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'invalid date-time',
  });
