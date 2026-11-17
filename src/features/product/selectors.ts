import type { CartLine } from '@/api/endpoints/cart';

/** Stock caption: "Sold out" at 0, "Only N left" at 1–3, else null. */
export function stockLabel(units: number): string | null {
  if (units === 0) return 'Sold out';
  if (units >= 1 && units <= 3) return `Only ${units} left`;
  return null;
}

/** Rounded rating average, or null when there are no ratings (never NaN). */
export function averageRating(ratings: { rating: number }[]): number | null {
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((acc, entry) => acc + entry.rating, 0);
  return Math.round(sum / ratings.length);
}

/** Units of a product already held across its purchasable cart lines. */
export function unitsInCartForProduct(
  cart: CartLine[],
  productId: string | number,
): number {
  return cart
    .filter(
      (line) =>
        line.product.id === productId &&
        line.isCustom === '0' &&
        !line.product.isMakeup,
    )
    .reduce((sum, line) => sum + line.units, 0);
}

/** Remaining purchasable stock once the cart's existing units are counted. */
export function remainingStockForProduct(
  cart: CartLine[],
  productId: string | number,
  stock: number,
): number {
  return Math.max(0, stock - unitsInCartForProduct(cart, productId));
}

export type AddToCartPlan =
  | { kind: 'update'; lineId: string | number; units: number }
  | { kind: 'add'; units: number }
  | { kind: 'full' };

/**
 * Decides how an add lands in the cart. A repeated add of the same product,
 * size and colour (all `isCustom === "0"`) merges into the existing line via
 * `updateCart`; the clamp counts the SUM of units across all lines of that
 * product, never exceeding stock.
 */
export function planAddToCart(
  cart: CartLine[],
  product: { id: string | number; units: number },
  sizeId: string | number,
  colorId: string | number,
  addUnits: number,
): AddToCartPlan {
  const lines = cart.filter(
    (line) =>
      line.product.id === product.id &&
      line.isCustom === '0' &&
      !line.product.isMakeup,
  );
  const remaining = remainingStockForProduct(cart, product.id, product.units);
  if (remaining === 0) return { kind: 'full' };

  const unitsToAdd = Math.min(addUnits, remaining);
  const matching = lines.find(
    (line) => line.size_id === sizeId && line.color_id === colorId,
  );
  if (matching) {
    return { kind: 'update', lineId: matching.id, units: matching.units + unitsToAdd };
  }
  return { kind: 'add', units: unitsToAdd };
}

/** Buy-now checkout path — ids only, never prices or totals. */
export function buyNowPath(
  productId: string | number,
  sizeId: string | number | null,
  colorId: string | number | null,
): string {
  return `/checkout?mode=buyNow&product=${productId}&size=${sizeId ?? 0}&color=${colorId ?? 0}&units=1`;
}
