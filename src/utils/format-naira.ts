/**
 * Nigerian Naira formatting — `₦` with thousands separators, no decimals.
 * One shared util everywhere (tokens.md §13). Manual grouping (no `Intl`).
 */
export function formatNaira(amount: number): string {
  const value = Number.isFinite(amount) ? Math.round(amount) : 0;
  const sign = value < 0 ? '-' : '';
  const digits = Math.abs(value).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `₦${sign}${grouped}`;
}
