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

/** Timestamps: UTC ISO-8601 strings ending in `Z` (verified against real payloads). */
export const dateTime = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'invalid date-time',
  });

/**
 * Date-only `YYYY-MM-DD`. The backend uses `"1970-01-01"` to mean "unset";
 * normalize that (and `null`) to `null` so the app never sees the sentinel.
 */
export const dateOnly = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.null()])
  .transform((value) =>
    value === '1970-01-01' || value === null ? null : value,
  );
