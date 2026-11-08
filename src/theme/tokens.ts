/**
 * Kikae design tokens — single TypeScript source of truth.
 *
 * Mirrors `docs/design/tokens.md`. No one-off values are allowed in screens;
 * every color, size, radius and duration is defined here (and consumed by
 * `tailwind.config.js`).
 *
 * Light/dark flip is done with CSS variables (`--kikae-*`) whose values are
 * defined per-scheme below. See `src/global.css` for the `:root` / `.dark`
 * (and system) definitions, and `tailwind.config.js` for the utility mapping.
 */

export const pure = {
  black: '#000000',
  white: '#FFFFFF',
} as const;

/** §1 Neutral gray scale — the only structural colors. */
export const gray = {
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#E5E5E5',
  300: '#D4D4D4',
  400: '#A3A3A3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  950: '#0A0A0A',
} as const;

/** §2 Semantic colors — muted status accents (icon + label only). */
export const semantic = {
  light: {
    success: '#1B7F4A',
    warning: '#8A5A00',
    error: '#B3261E',
    info: '#1B5E8A',
  },
  dark: {
    success: '#4ADE80',
    warning: '#FFD699',
    error: '#F2B8B5',
    info: '#9BD0F5',
  },
} as const;

/** §3 Semantic color roles (light + dark). */
export const roles = {
  light: {
    canvas: '#FAFAFA',
    surface: '#FFFFFF',
    'surface-overlay': '#FFFFFF',
    line: '#E5E5E5',
    'line-strong': '#737373',
    divider: '#E5E5E5',
    fg: '#171717',
    'fg-secondary': '#404040',
    'fg-muted': '#525252',
    'fg-disabled': '#A3A3A3',
    'fg-placeholder': '#737373',
    'on-primary': '#FFFFFF',
    'on-primary-disabled': '#525252',
    'on-scrim': '#FFFFFF',
    primary: '#000000',
    'primary-pressed': '#262626',
    'primary-disabled': '#D4D4D4',
    icon: '#171717',
    'icon-muted': '#525252',
    skeleton: '#E5E5E5',
    scrim: 'rgba(0, 0, 0, 0.6)',
    'modal-backdrop': 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    canvas: '#0A0A0A',
    surface: '#171717',
    'surface-overlay': '#262626',
    line: '#404040',
    'line-strong': '#737373',
    divider: '#262626',
    fg: '#FAFAFA',
    'fg-secondary': '#D4D4D4',
    'fg-muted': '#A3A3A3',
    'fg-disabled': '#525252',
    'fg-placeholder': '#A3A3A3',
    'on-primary': '#000000',
    'on-primary-disabled': '#A3A3A3',
    'on-scrim': '#FFFFFF',
    primary: '#FFFFFF',
    'primary-pressed': '#E5E5E5',
    'primary-disabled': '#404040',
    icon: '#FAFAFA',
    'icon-muted': '#A3A3A3',
    skeleton: '#262626',
    scrim: 'rgba(0, 0, 0, 0.6)',
    'modal-backdrop': 'rgba(0, 0, 0, 0.5)',
  },
} as const;

export type ColorScheme = keyof typeof roles;
export type RoleToken = keyof (typeof roles)['light'];
export type SemanticToken = keyof (typeof semantic)['light'];

/** §5 Elevation (borders + tone steps, not shadows). */
export const elevation = {
  0: { light: 'canvas', dark: 'canvas' },
  1: { light: 'surface', dark: 'surface' },
  2: { light: 'surface-overlay', dark: 'surface-overlay' },
} as const;

/** §6 Focus ring — two concentric rings (2px inner + 2px gap + 2px outer). */
export const focus = {
  width: 2,
  gap: 2,
  light: { inner: '#000000', outer: '#FFFFFF' },
  dark: { inner: '#FFFFFF', outer: '#000000' },
  imagery: { inner: '#FFFFFF', outer: '#000000' },
} as const;

/** §7 Type scale. Weights restricted to 400/500/700. Line-heights raised for
 * Poppins' taller ascender/descender metrics (no clipping at 200%). */
export const type = {
  display: { size: 34, lineHeight: 44, weight: 700 },
  'title-1': { size: 28, lineHeight: 36, weight: 700 },
  'title-2': { size: 22, lineHeight: 30, weight: 500 },
  'title-3': { size: 20, lineHeight: 27, weight: 500 },
  headline: { size: 17, lineHeight: 24, weight: 500 },
  // iOS default; Android/web use 16 (see tokens.md §7).
  body: { size: 17, lineHeight: 24, weight: 400 },
  callout: { size: 15, lineHeight: 21, weight: 400 },
  subhead: { size: 14, lineHeight: 20, weight: 500 },
  footnote: { size: 13, lineHeight: 19, weight: 400 },
  caption: { size: 12, lineHeight: 17, weight: 400 },
} as const;

export type TypeToken = keyof typeof type;
export const typeWeights = { regular: 400, medium: 500, bold: 700 } as const;

/**
 * §7b Font families. Poppins (OFL) at 400/500/700 only. `family` is the native
 * face (the platform default is the fallback); `stack` is the web font-family
 * value with the old system stack as fallback.
 */
export const fontFamilies = {
  regular: {
    family: 'Poppins_400Regular',
    stack:
      "Poppins_400Regular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  medium: {
    family: 'Poppins_500Medium',
    stack:
      "Poppins_500Medium, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  bold: {
    family: 'Poppins_700Bold',
    stack:
      "Poppins_700Bold, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
} as const;

export type FontFamilyToken = keyof typeof fontFamilies;

/** Maps a numeric weight (400/500/700) to its Poppins family token. */
export function fontFamilyForWeight(weight: number): FontFamilyToken {
  if (weight >= 700) return 'bold';
  if (weight >= 500) return 'medium';
  return 'regular';
}

/** §8 Spacing scale (4px base). */
export const spacing = [
  0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96,
] as const;

/** §9 Radii. */
export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

/** §10 Motion. */
export const motion = {
  fast: 120,
  base: 200,
  slow: 300,
  ease: 'cubic-bezier(0.2, 0, 0, 1)',
  reduced: 0,
} as const;

/** §11 Icon sizes (24 is the default interactive size). */
export const iconSizes = [16, 20, 24, 28, 32] as const;

/** §14 Size & interaction tokens. */
export const sizes = {
  'touch-target-min': 44,
  avatar: { xs: 24, sm: 32, md: 40, lg: 56, xl: 96 },
  image: {
    card: '4:5',
    banner: '16:9',
    'banner-wide': '5:2',
    square: '1:1',
    story: '9:16',
  },
} as const;

/** CSS variable prefix used in `tailwind.config.js` and `src/global.css`. */
export const cssVarPrefix = '--kikae-';

/** Maps a token key to its CSS variable name (e.g. `surface-overlay` -> `--kikae-surface-overlay`). */
export function cssVarName(token: string): string {
  return `${cssVarPrefix}${token}`;
}

/**
 * §4 Contrast pairs — the WCAG checks from tokens.md.
 * `min` is the required ratio; `exempt` pairs are skipped by the test.
 */
export interface ContrastPair {
  label: string;
  fg: string;
  bg: string;
  /** Required minimum contrast ratio. */
  min: number;
  /** Decorative / non-text-only pairs that are exempt from the AA check. */
  exempt?: boolean;
}

const { light, dark } = roles;
const semLight = semantic.light;
const semDark = semantic.dark;

export const contrastPairs: ContrastPair[] = [
  // Neutral text pairs (body/large text; min 4.5, large 3.0).
  { label: 'fg on surface (light)', fg: light.fg, bg: light.surface, min: 4.5 },
  { label: 'fg on canvas (light)', fg: light.fg, bg: light.canvas, min: 4.5 },
  {
    label: 'fg-secondary on surface (light)',
    fg: light['fg-secondary'],
    bg: light.surface,
    min: 4.5,
  },
  {
    label: 'fg-secondary on canvas (light)',
    fg: light['fg-secondary'],
    bg: light.canvas,
    min: 4.5,
  },
  {
    label: 'fg-muted on surface (light)',
    fg: light['fg-muted'],
    bg: light.surface,
    min: 4.5,
  },
  {
    label: 'fg-muted on canvas (light)',
    fg: light['fg-muted'],
    bg: light.canvas,
    min: 4.5,
  },
  {
    label: 'fg-placeholder on surface (light)',
    fg: light['fg-placeholder'],
    bg: light.surface,
    min: 4.5,
  },
  {
    label: 'fg-placeholder on canvas (light)',
    fg: light['fg-placeholder'],
    bg: light.canvas,
    min: 4.5,
  },
  {
    label: 'fg-disabled on surface (light)',
    fg: light['fg-disabled'],
    bg: light.surface,
    min: 4.5,
    exempt: true,
  },
  {
    label: 'on-primary on primary (light)',
    fg: light['on-primary'],
    bg: light.primary,
    min: 4.5,
  },
  {
    label: 'on-primary-disabled on primary-disabled (light)',
    fg: light['on-primary-disabled'],
    bg: light['primary-disabled'],
    min: 4.5,
  },
  { label: 'fg on canvas (dark)', fg: dark.fg, bg: dark.canvas, min: 4.5 },
  {
    label: 'fg-secondary on canvas (dark)',
    fg: dark['fg-secondary'],
    bg: dark.canvas,
    min: 4.5,
  },
  {
    label: 'fg-muted on canvas (dark)',
    fg: dark['fg-muted'],
    bg: dark.canvas,
    min: 4.5,
  },
  {
    label: 'fg-muted on surface (dark)',
    fg: dark['fg-muted'],
    bg: dark.surface,
    min: 4.5,
  },
  {
    label: 'fg-muted on surface-overlay (dark)',
    fg: dark['fg-muted'],
    bg: dark['surface-overlay'],
    min: 4.5,
  },
  {
    label: 'on-primary on primary (dark)',
    fg: dark['on-primary'],
    bg: dark.primary,
    min: 4.5,
  },
  {
    label: 'on-primary-disabled on primary-disabled (dark)',
    fg: dark['on-primary-disabled'],
    bg: dark['primary-disabled'],
    min: 3.0,
  },

  // Semantic pairs (icon + label, verified on every surface). min 4.5.
  {
    label: 'success on surface (light)',
    fg: semLight.success,
    bg: light.surface,
    min: 4.5,
  },
  {
    label: 'success on canvas (light)',
    fg: semLight.success,
    bg: light.canvas,
    min: 4.5,
  },
  {
    label: 'success on canvas (dark)',
    fg: semDark.success,
    bg: dark.canvas,
    min: 4.5,
  },
  {
    label: 'success on surface (dark)',
    fg: semDark.success,
    bg: dark.surface,
    min: 4.5,
  },
  {
    label: 'success on surface-overlay (dark)',
    fg: semDark.success,
    bg: dark['surface-overlay'],
    min: 4.5,
  },
  {
    label: 'warning on surface (light)',
    fg: semLight.warning,
    bg: light.surface,
    min: 4.5,
  },
  {
    label: 'warning on canvas (light)',
    fg: semLight.warning,
    bg: light.canvas,
    min: 4.5,
  },
  {
    label: 'warning on canvas (dark)',
    fg: semDark.warning,
    bg: dark.canvas,
    min: 4.5,
  },
  {
    label: 'warning on surface (dark)',
    fg: semDark.warning,
    bg: dark.surface,
    min: 4.5,
  },
  {
    label: 'warning on surface-overlay (dark)',
    fg: semDark.warning,
    bg: dark['surface-overlay'],
    min: 4.5,
  },
  {
    label: 'error on surface (light)',
    fg: semLight.error,
    bg: light.surface,
    min: 4.5,
  },
  {
    label: 'error on canvas (light)',
    fg: semLight.error,
    bg: light.canvas,
    min: 4.5,
  },
  {
    label: 'error on canvas (dark)',
    fg: semDark.error,
    bg: dark.canvas,
    min: 4.5,
  },
  {
    label: 'error on surface (dark)',
    fg: semDark.error,
    bg: dark.surface,
    min: 4.5,
  },
  {
    label: 'error on surface-overlay (dark)',
    fg: semDark.error,
    bg: dark['surface-overlay'],
    min: 4.5,
  },
  {
    label: 'info on surface (light)',
    fg: semLight.info,
    bg: light.surface,
    min: 4.5,
  },
  {
    label: 'info on canvas (light)',
    fg: semLight.info,
    bg: light.canvas,
    min: 4.5,
  },
  {
    label: 'info on canvas (dark)',
    fg: semDark.info,
    bg: dark.canvas,
    min: 4.5,
  },
  {
    label: 'info on surface (dark)',
    fg: semDark.info,
    bg: dark.surface,
    min: 4.5,
  },
  {
    label: 'info on surface-overlay (dark)',
    fg: semDark.info,
    bg: dark['surface-overlay'],
    min: 4.5,
  },

  // Non-text (icons, input borders, focus). min 3.0.
  {
    label: 'line-strong on surface (light)',
    fg: light['line-strong'],
    bg: light.surface,
    min: 3.0,
  },
  {
    label: 'line-strong on surface (dark)',
    fg: dark['line-strong'],
    bg: dark.surface,
    min: 3.0,
  },

  // Scrim over white — white text on composited scrim values (min 4.5, text).
  { label: 'white text on scrim 60%', fg: '#FFFFFF', bg: '#666666', min: 4.5 },
  { label: 'white text on scrim 70%', fg: '#FFFFFF', bg: '#4D4D4D', min: 4.5 },
  { label: 'white text on scrim 80%', fg: '#FFFFFF', bg: '#333333', min: 4.5 },

  // Elevation tone — non-text only, exempt.
  {
    label: 'surface on canvas (elevation tone)',
    fg: light.surface,
    bg: light.canvas,
    min: 3.0,
    exempt: true,
  },
];
