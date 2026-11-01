import { Pressable } from 'react-native';
import { clsx } from 'tailwind-variants';

import { focusRing } from '@/components/ui/constants';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export type ChipRole = 'filter' | 'category' | 'tab';

const accessibilityRoleByRole: Record<ChipRole, 'button' | 'link' | 'tab'> = {
  filter: 'button',
  category: 'link',
  tab: 'tab',
};

export interface ChipProps {
  /** Semantic role; keep it explicit per use (components.md §1). */
  role: ChipRole;
  label: string;
  /** Selected state (black bg / white text, inverted in dark). */
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  /** Optional leading icon. */
  icon?: IconName;
}

/**
 * Pill chip with three explicit roles: filter toggle and tab announce their
 * on/off state via `selected` (RN has no `aria-pressed`); category uses
 * `role="link"`.
 */
export function Chip({
  role,
  label,
  selected = false,
  disabled = false,
  onPress,
  icon,
}: ChipProps) {
  // React Native has no `aria-pressed`; a filter toggle announces its on/off
  // state via `selected` (the native equivalent), as does a tab.
  const accessibilityState =
    role === 'category' ? { disabled } : { selected, disabled };

  const color = selected ? 'on-primary' : disabled ? 'fg-disabled' : 'fg';

  return (
    <Pressable
      accessibilityRole={accessibilityRoleByRole[role]}
      accessibilityState={accessibilityState}
      disabled={disabled}
      onPress={onPress}
      className={clsx(
        'h-40 flex-row items-center justify-center gap-8 rounded-full border px-16',
        selected ? 'border-primary bg-primary' : 'border-line bg-surface',
        disabled && 'border-line',
        focusRing,
      )}
    >
      {icon ? <Icon name={icon} size={16} color={color} aria-hidden /> : null}
      <Text variant="callout" color={color} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
    </Pressable>
  );
}
