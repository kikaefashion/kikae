/**
 * Accepts only internal redirect targets: a path that starts with `/` but not
 * `//` (which would be protocol-relative). Rejects external URLs and relative
 * paths so `redirectTo` can never be used as an open redirect.
 */
export function sanitizeRedirectTo(
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  if (!value.startsWith('/')) return undefined;
  if (value.startsWith('//')) return undefined;
  return value;
}
