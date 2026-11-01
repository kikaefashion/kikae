import { Pressable, View } from 'react-native';
import { clsx } from 'tailwind-variants';

import { focusRing, TOUCH_TARGET } from '@/components/ui/constants';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export interface CheckboxProps {
  checked: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  /** Optional label; makes the whole row pressable. */
  label?: string;
  /** Accessible name when `label` is not provided. */
  'aria-label'?: string;
}

/**
 * Line-strong checkbox control with a black/white check when selected and a
 * 44px touch target.
 */
export function Checkbox({
  checked,
  onValueChange,
  disabled = false,
  label,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={ariaLabel ?? label}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!checked)}
      className={clsx('flex-row items-center gap-8', focusRing)}
      style={{ minHeight: TOUCH_TARGET, minWidth: TOUCH_TARGET }}
    >
      <View
        className={clsx(
          'h-24 w-24 items-center justify-center rounded-xs border',
          checked ? 'border-primary bg-primary' : 'border-line-strong',
        )}
      >
        {checked ? (
          <Icon name="checkmark" size={20} color="on-primary" aria-hidden />
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
