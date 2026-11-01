/**
 * Order status normalization (backend-findings.md — Frontend API-client rules).
 *
 * General rule: `trim` → `toLowerCase` → spaces to `_` → map. Unknown values
 * map to `"unknown"` so the UI renders generically instead of crashing.
 */

export const ORDER_STATUSES = [
  'order_placed',
  'ready_for_delivery',
  'dispatched',
  'delivered',
  'service_booked',
  'service_pending',
  'settled',
  'unknown',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const KNOWN: Record<string, OrderStatus> = {
  order_placed: 'order_placed',
  ready_for_delivery: 'ready_for_delivery',
  dispatched: 'dispatched',
  delivered: 'delivered',
  service_booked: 'service_booked',
  service_pending: 'service_pending',
  settled: 'settled',
};

export function normalizeOrderStatus(raw: string): OrderStatus {
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, '_');
  return KNOWN[normalized] ?? 'unknown';
}
