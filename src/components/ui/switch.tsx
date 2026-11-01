import { Pressable, View } from 'react-native';
import { clsx } from 'tailwind-variants';

import { focusRing, TOUCH_TARGET } from '@/components/ui/constants';
import { Text } from '@/components/ui/text';

export interface SwitchProps {
  checked: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  /** Optional label; makes the whole row pressable. */
  label?: string;
  /** Accessible name when `label` is not provided. */
  'aria-label'?: string;
}

/**
 * Monochrome switch (primary track + surface thumb). `role="switch"` with a
 * checked state.
 */
export function Switch({
  checked,
  onValueChange,
  disabled = false,
  label,
  'aria-label': ariaLabel,
}: SwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={ariaLabel ?? label}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!checked)}
      className={clsx('flex-row items-center gap-8', focusRing)}
      style={{ minHeight: TOUCH_TARGET }}
    >
      <View
        className={clsx(
          'h-32 w-48 flex-row items-center rounded-full p-4',
          checked ? 'justify-end bg-primary' : 'justify-start bg-line-strong',
        )}
      >
        <View className="h-24 w-24 rounded-full bg-surface" />
      </View>
      {label ? (
        <Text variant="body" color={disabled ? 'fg-disabled' : 'fg'}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}
