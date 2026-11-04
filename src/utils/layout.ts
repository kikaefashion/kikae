import { useWindowDimensions } from 'react-native';

/**
 * Responsive grid helpers — container-based columns with a breakpoint-based
 * gap (layout-system.md §1–2). One shared `useColumnCount`; never hand-rolled
 * per screen.
 */

export const BREAKPOINTS = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

const MIN_CARD_WIDTH = 160;
const MIN_COLUMNS = 2;
const MAX_COLUMNS = 5;

export function getBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'base';
}

/**
 * `columns = clamp(minColumns, floor((containerWidth + gap) / (minCardWidth + gap)), maxColumns)`
 * with `gap = width >= 1024 ? 24 : 16`.
 */
export function computeColumns(containerWidth: number): number {
  const gap = containerWidth >= BREAKPOINTS.lg ? 24 : 16;
  const columns = Math.floor((containerWidth + gap) / (MIN_CARD_WIDTH + gap));
  return Math.min(Math.max(columns, MIN_COLUMNS), MAX_COLUMNS);
}

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return getBreakpoint(width);
}

export function useColumnCount(): number {
  const { width } = useWindowDimensions();
  return computeColumns(width);
}

/** True at the `lg` breakpoint (1024) and wider — where nav switches to a sidebar. */
export function useDesktopLayout(): boolean {
  const { width } = useWindowDimensions();
  return width >= BREAKPOINTS.lg;
}
