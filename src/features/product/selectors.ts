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
