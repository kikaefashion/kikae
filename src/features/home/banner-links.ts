import type { Banner } from '@/api/endpoints/banners';
import type { CarouselSlide } from '@/components/ui/carousel';
import { mediaUrl } from '@/utils/media-url';

/**
 * Whitelist from banner `url` values to app routes. `"/"` maps to the Makeup
 * tab — the legacy carousel just pushed `url` itself (so `"/"` went home), which
 * is ambiguous; the banner titled "Makeup" is the one linked there. `/stores`
 * and `/freebies` map to stub routes. Any other value is shown but not tappable
 * (resolves to null).
 */
const BANNER_ROUTES: Record<string, string> = {
  '/': '/makeup',
  '/stores': '/stores',
  '/freebies': '/freebies',
};

export function bannerHref(url: string): string | null {
  return BANNER_ROUTES[url] ?? null;
}

export function toCarouselSlide(banner: Banner): CarouselSlide {
  return {
    id: banner.id,
    title: banner.title,
    text: banner.text,
    imageUrl: mediaUrl(banner.file),
    href: bannerHref(banner.url),
  };
}
