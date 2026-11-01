import { Pressable, View } from 'react-native';
import { clsx } from 'tailwind-variants';

import { focusRing, TOUCH_TARGET } from '@/components/ui/constants';
import { Text } from '@/components/ui/text';

export interface RadioProps {
  checked: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  /** Optional label; makes the whole row pressable. */
  label?: string;
  /** Accessible name when `label` is not provided. */
  'aria-label'?: string;
}

/**
 * Line-strong radio control with a filled monochrome dot when selected and a
 * 44px touch target.
 */
export function Radio({
  checked,
  onValueChange,
  disabled = false,
  label,
  'aria-label': ariaLabel,
}: RadioProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={ariaLabel ?? label}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!checked)}
      className={clsx('flex-row items-center gap-8', focusRing)}
      style={{ minHeight: TOUCH_TARGET, minWidth: TOUCH_TARGET }}
    >
      <View
        className={clsx(
          'h-24 w-24 items-center justify-center rounded-full border',
          checked ? 'border-primary' : 'border-line-strong',
        )}
      >
        {checked ? (
          <View className="h-12 w-12 rounded-full bg-primary" />
        ) : null}
      </View>
      {label ? (
        <Text variant="body" color={disabled ? 'fg-disabled' : 'fg'}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}
