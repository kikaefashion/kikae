import { env } from '@/config/env';

const ABSOLUTE_URL = /^https?:\/\//i;

/**
 * Resolves a backend media path to a full URL. Relative paths
 * ("profile-pic/x.webp") are prefixed with the media origin; absolute URLs
 * pass through unchanged; empty/null values return null.
 */
export function mediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (ABSOLUTE_URL.test(value)) return value;
  const base = env.mediaUrlPrefix.endsWith('/')
    ? env.mediaUrlPrefix
    : `${env.mediaUrlPrefix}/`;
  return `${base}${value.replace(/^\/+/, '')}`;
}
