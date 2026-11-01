import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { useTextColor, type TextColor } from '@/components/ui/colors';

export type IconName = ComponentProps<typeof Ionicons>['name'];
export type IconSize = 16 | 20 | 24 | 28 | 32;

export interface IconProps {
  name: IconName;
  /** Icon size from tokens.md §11 (defaults to the interactive 24). */
  size?: IconSize;
  /** Monochrome color token (tokens.md §3–4); default `icon`. */
  color?: TextColor;
  /** Mark decorative icons as hidden from the accessibility tree. */
  'aria-hidden'?: boolean;
}

/**
 * Single monochrome icon primitive (Ionicons). Resolves the color token to a
 * concrete hex for the current scheme so it works on native and web alike.
 */
export function Icon({
  name,
  size = 24,
  color = 'icon',
  'aria-hidden': ariaHidden = false,
}: IconProps) {
  const resolvedColor = useTextColor(color);
  return (
    <Ionicons
      name={name}
      size={size}
      color={resolvedColor}
      accessibilityElementsHidden={ariaHidden}
      importantForAccessibility={ariaHidden ? 'no-hide-descendants' : undefined}
    />
  );
}
