import type { Href } from 'expo-router';

import type { IconName } from '@/components/ui/icon';

/** Top bar height per layout-system.md §3 (mobile / desktop). */
export const TOP_BAR_HEIGHT = { mobile: 56, desktop: 64 } as const;

/** Bottom tab bar height, excluding the safe-area inset. */
export const TAB_BAR_HEIGHT = 56;

/** Fixed sidebar width at `lg` and wider. */
export const SIDEBAR_WIDTH = 256;

export interface NavEntry {
  /** Unique trigger name (matches the route name). */
  name: string;
  href: Href;
  label: string;
  /** Filled glyph, used when the tab is active. */
  icon: IconName;
  /** Outline glyph, used when the tab is inactive. */
  iconOutline: IconName;
}

/**
 * The five primary tabs. Profile reads "Sign in" for guests (layout-system.md
 * §3) while staying a browsable tab.
 */
export function getNavEntries(signedIn: boolean): NavEntry[] {
  return [
    {
      name: 'index',
      href: '/' as Href,
      label: 'Home',
      icon: 'home',
      iconOutline: 'home-outline',
    },
    {
      name: 'discover',
      href: '/discover' as Href,
      label: 'Discover',
      icon: 'compass',
      iconOutline: 'compass-outline',
    },
    {
      name: 'runway',
      href: '/runway' as Href,
      label: 'Runway',
      icon: 'play-circle',
      iconOutline: 'play-circle-outline',
    },
    {
      name: 'makeup',
      href: '/makeup' as Href,
      label: 'Makeup',
      icon: 'sparkles',
      iconOutline: 'sparkles-outline',
    },
    {
      name: 'profile',
      href: '/profile' as Href,
      label: signedIn ? 'Profile' : 'Sign in',
      icon: 'person',
      iconOutline: 'person-outline',
    },
  ];
}
