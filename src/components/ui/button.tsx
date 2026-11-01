import type { ElementRef, ReactNode } from 'react';
import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { clsx } from 'tailwind-variants';

import { useTextColor, type TextColor } from '@/components/ui/colors';
import { focusRing } from '@/components/ui/constants';
import { Icon, type IconName, type IconSize } from '@/components/ui/icon';
import { Text, type TextVariant } from '@/components/ui/text';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base = 'flex-row items-center justify-center rounded-full';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-surface border border-line-strong',
  text: 'bg-transparent',
  danger: 'bg-surface border border-error',
};

const variantClassesDisabled: Record<ButtonVariant, string> = {
  primary: 'bg-primary-disabled',
  secondary: 'bg-surface border border-line',
  text: 'bg-transparent',
  danger: 'bg-surface border border-line',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-40 px-16 gap-8',
  md: 'h-48 px-20 gap-8',
  lg: 'h-56 w-full px-24 gap-8',
};

const labelVariant: Record<ButtonSize, TextVariant> = {
  sm: 'callout',
  md: 'callout',
  lg: 'body',
};

function labelColor(variant: ButtonVariant, disabled: boolean): TextColor {
  if (disabled)
    return variant === 'primary' ? 'on-primary-disabled' : 'fg-disabled';
  if (variant === 'primary') return 'on-primary';
  if (variant === 'danger') return 'error';
  return 'fg';
}

export interface ButtonProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner in place of the icon and blocks presses; keeps width. */
  loading?: boolean;
  /** Optional leading icon (required by convention for `danger`). */
  icon?: IconName;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pill button in four variants and three sizes. Disabled uses a dedicated
 * background (never opacity-only); loading keeps width and announces "loading".
 */
export const Button = forwardRef<ElementRef<typeof Pressable>, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      children,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const color = labelColor(variant, disabled);
    const spinnerColor = useTextColor(
      variant === 'primary'
        ? disabled
          ? 'on-primary-disabled'
          : 'on-primary'
        : disabled
          ? 'fg-disabled'
          : 'fg',
    );
    const iconSize: IconSize = size === 'lg' ? 24 : 20;

    return (
      <Pressable
        ref={ref}
        {...props}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        disabled={disabled || loading}
        className={clsx(
          base,
          disabled ? variantClassesDisabled[variant] : variantClasses[variant],
          sizeClasses[size],
          className,
          focusRing,
        )}
        style={({ pressed }) => [
          pressed && !disabled
            ? { opacity: 0.7, transform: [{ scale: 0.96 }] }
            : null,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : icon ? (
          <Icon name={icon} size={iconSize} color={color} aria-hidden />
        ) : null}
        <Text
          variant={labelVariant[size]}
          color={color}
          weight="medium"
          maxFontSizeMultiplier={1.3}
        >
          {children}
        </Text>
      </Pressable>
    );
  },
);
