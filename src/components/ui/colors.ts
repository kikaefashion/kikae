import { useColorScheme } from '@/hooks/use-color-scheme';
import { roles, semantic } from '@/theme/tokens';

export type Scheme = 'light' | 'dark';

/**
 * Text/icon color tokens (role + semantic) that a `Text` or `Icon` may use.
 * Resolved to a NativeWind `text-*` class (Text) or a concrete hex (Icon).
 */
export type TextColor =
  | 'fg'
  | 'fg-secondary'
  | 'fg-muted'
  | 'fg-disabled'
  | 'fg-placeholder'
  | 'on-primary'
  | 'on-primary-disabled'
  | 'on-scrim'
  | 'icon'
  | 'icon-muted'
  | 'primary'
  | 'line-strong'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** NativeWind `text-*` classes for each text color token. */
export const textColorClasses: Record<TextColor, string> = {
  fg: 'text-fg',
  'fg-secondary': 'text-fg-secondary',
  'fg-muted': 'text-fg-muted',
  'fg-disabled': 'text-fg-disabled',
  'fg-placeholder': 'text-fg-placeholder',
  'on-primary': 'text-on-primary',
  'on-primary-disabled': 'text-on-primary-disabled',
  'on-scrim': 'text-on-scrim',
  icon: 'text-icon',
  'icon-muted': 'text-icon-muted',
  primary: 'text-primary',
  'line-strong': 'text-line-strong',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
};

const roleKeys = new Set<string>(Object.keys(roles.light));

/** Resolve a text/icon color token to a concrete hex for the given scheme. */
export function textColorHex(scheme: Scheme, color: TextColor): string {
  if (roleKeys.has(color)) {
    return roles[scheme][color as keyof typeof roles.light];
  }
  return semantic[scheme][color as keyof typeof semantic.light];
}

/** Current color scheme ('light'/'dark'); defaults to light. */
export function useScheme(): Scheme {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}

/** Resolve a text/icon color token to a concrete hex for the current scheme. */
export function useTextColor(color: TextColor): string {
  return textColorHex(useScheme(), color);
}
