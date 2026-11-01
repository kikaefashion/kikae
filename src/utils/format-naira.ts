/**
 * Nigerian Naira formatting — `₦` with thousands separators, no decimals.
 * One shared util everywhere (tokens.md §13).
 */
const nairaFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatNaira(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return `₦${nairaFormatter.format(Math.round(value))}`;
}
