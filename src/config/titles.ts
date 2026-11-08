/** App name used as the fallback and suffix for web document titles. */
export const APP_TITLE = 'Kikae';

/**
 * Per-route page titles. Centralized here so the strings can be localized
 * later without touching the routes. `formatDocumentTitle` composes each into
 * the "<title> | Kikae" format.
 */
export const PAGE_TITLES = {
  login: 'Log in',
  home: 'Home',
  discover: 'Discover',
  runway: 'Runway',
  makeup: 'Makeup',
  profile: 'Profile',
  cart: 'Cart',
  notifications: 'Notifications',
  stores: 'Stores',
  freebies: 'Freebies',
  designSystem: 'Design system',
} as const;

export type PageTitleKey = keyof typeof PAGE_TITLES;

/** Builds a full document title: "Log in | Kikae", or just "Kikae" when omitted. */
export function formatDocumentTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${APP_TITLE}` : APP_TITLE;
}
