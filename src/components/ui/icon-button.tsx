import type { ElementRef } from 'react';
import { forwardRef } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { clsx } from 'tailwind-variants';

import { type TextColor } from '@/components/ui/colors';
import { focusRing, TOUCH_TARGET } from '@/components/ui/constants';
import { Icon, type IconName, type IconSize } from '@/components/ui/icon';

export interface IconButtonProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  icon: IconName;
  /** Describes the action for assistive tech (required). */
  label: string;
  /** Icon size from tokens.md §11; default 24. */
  size?: IconSize;
  /** Monochrome color token; default `icon`. */
  color?: TextColor;
  style?: StyleProp<ViewStyle>;
}

/**
 * 44×44 pressable icon. Pressed scales down; disabled grays the glyph out and
 * blocks the press.
 */
export const IconButton = forwardRef<
  ElementRef<typeof Pressable>,
  IconButtonProps
>(function IconButton(
  {
    icon,
    label,
    size = 24,
    color = 'icon',
    disabled = false,
    className,
    style,
    ...props
  },
  ref,
) {
  return (
    <Pressable
      ref={ref}
      {...props}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      className={clsx(
        'items-center justify-center rounded-full',
        className,
        focusRing,
      )}
      style={({ pressed }) => [
        { width: TOUCH_TARGET, height: TOUCH_TARGET },
        pressed && !disabled
          ? { opacity: 0.7, transform: [{ scale: 0.96 }] }
          : null,
        style,
      ]}
    >
      <Icon
        name={icon}
        size={size}
        color={disabled ? 'fg-disabled' : color}
        aria-hidden
      />
    </Pressable>
  );
});
