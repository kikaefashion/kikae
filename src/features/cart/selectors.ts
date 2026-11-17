import type { CartLine } from '@/api/endpoints/cart';

/**
 * A cart line the app can check out: not custom, not makeup, not free, the
 * product is approved and still in stock. Excluded lines render with a reason
 * and never enter the checkout ids or the TopBar badge.
 */
export function isAvailableLine(line: CartLine): boolean {
  return (
    line.isCustom === '0' &&
    !line.product.isMakeup &&
    line.product.price !== 0 &&
    line.product.status === 'approved' &&
    line.product.units > 0
  );
}

export type ExcludedReason = 'not-available' | 'free';

/** Why a line is excluded from checkout, or null when purchasable. */
export function lineExclusion(line: CartLine): ExcludedReason | null {
  if (isAvailableLine(line)) return null;
  return line.product.price === 0 ? 'free' : 'not-available';
}

/** Checkout ids — the ids of available lines only. */
export function checkoutIds(cart: CartLine[]): (string | number)[] {
  return cart.filter(isAvailableLine).map((line) => line.id);
}

/** TopBar badge: the sum of units across available lines. */
export function cartUnits(cart: CartLine[]): number {
  return cart
    .filter(isAvailableLine)
    .reduce((sum, line) => sum + line.units, 0);
}

/** Estimated subtotal across available lines (client display only). */
export function cartSubtotal(cart: CartLine[]): number {
  return cart
    .filter(isAvailableLine)
    .reduce((sum, line) => sum + line.product.price * line.units, 0);
}

/**
 * Units a line may still hold, counting the SUM of units across its sibling
 * lines of the same product so the total never exceeds stock.
 */
export function unitsAvailableForLine(
  cart: CartLine[],
  line: CartLine,
): number {
  const others = cart
    .filter(
      (other) =>
        other.id !== line.id &&
        other.product.id === line.product.id &&
        isAvailableLine(other),
    )
    .reduce((sum, other) => sum + other.units, 0);
  return Math.max(0, line.product.units - others);
}
