import type { ProductDetail } from '@/api/endpoints/product';

/** Liked state is derived from `likes[]`, never stored separately. */
export function isProductLiked(
  product: ProductDetail,
  userId: string | number | null,
): boolean {
  if (userId == null) return false;
  return product.likes.some(
    (like) =>
      like.user_id === userId && (like.like === 1 || like.like === true),
  );
}

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
