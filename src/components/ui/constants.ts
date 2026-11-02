import { sizes } from '@/theme/tokens';

/** Minimum interactive touch target (tokens.md §14) — 44px. */
export const TOUCH_TARGET = sizes['touch-target-min'];

/**
 * Two-tone focus ring class (tokens.md §6), defined in `src/global.css` as a
 * `:focus-visible` box-shadow. Applied to every interactive element. It is a
 * no-op on native (NativeWind ignores classes it does not recognize).
 */
export const focusRing = 'focus-ring';
