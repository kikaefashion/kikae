import type { ComponentProps } from 'react';
import { Platform, Text as RNText } from 'react-native';
import { clsx } from 'tailwind-variants';

import { textColorClasses, type TextColor } from '@/components/ui/colors';
import {
  fontFamilies,
  fontFamilyForWeight,
  type as typeScale,
  typeWeights,
  type TypeToken,
} from '@/theme/tokens';

export type TextVariant = TypeToken;
export type TextWeight = keyof typeof typeWeights;

const typeClasses: Record<TextVariant, string> = {
  display: 'text-display',
  'title-1': 'text-title-1',
  'title-2': 'text-title-2',
  'title-3': 'text-title-3',
  headline: 'text-headline',
  body: 'text-body',
  callout: 'text-callout',
  subhead: 'text-subhead',
  footnote: 'text-footnote',
  caption: 'text-caption',
};

export interface TextProps extends ComponentProps<typeof RNText> {
  /** Type-scale token (tokens.md §7); carries size, line-height and weight. */
  variant?: TextVariant;
  /** Text color token (tokens.md §3–4). */
  color?: TextColor;
  /** Optional weight override (tokens.md §7; 400/500/700). */
  weight?: TextWeight;
}

/** Resolves a weight to its Poppins family + platform fallback. */
function fontStyleForWeight(weight: number) {
  const token = fontFamilyForWeight(weight);
  const family =
    Platform.OS === 'web'
      ? fontFamilies[token].stack
      : fontFamilies[token].family;
  // Each weight is its own family, so keep `fontWeight` normal to avoid Android
  // synthesizing bold on top of an already-bold face.
  return { fontFamily: family, fontWeight: 'normal' as const };
}

/**
 * Theme-aware text primitive. Uses the type scale + semantic color tokens, and
 * defaults to a 200% max font scale (fixed-height elements opt into 1.3).
 */
export function Text({
  variant = 'body',
  color = 'fg',
  weight,
  className,
  style,
  maxFontSizeMultiplier = 2,
  ...props
}: TextProps) {
  const resolvedWeight = weight
    ? typeWeights[weight]
    : typeScale[variant].weight;

  return (
    <RNText
      {...props}
      className={clsx(typeClasses[variant], textColorClasses[color], className)}
      style={[fontStyleForWeight(resolvedWeight), style]}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
    />
  );
}
