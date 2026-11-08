import { View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export type BadgeStatus = 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  /** Count pill (cart/unread). Renders `max+` above the cap (default 99). */
  count?: number;
  max?: number;
  /** Status badge: icon + label in the muted semantic color. */
  status?: BadgeStatus;
  label?: string;
  icon?: IconName;
}

/**
 * Two modes: a black/white count pill, or a status badge pairing an icon with
 * a label in the muted semantic color (components.md §2).
 */
export function Badge({ count, max = 99, status, label, icon }: BadgeProps) {
  if (status) {
    return (
      <View className="flex-row items-center gap-4">
        {icon ? (
          <Icon name={icon} size={16} color={status} aria-hidden />
        ) : null}
        {label ? (
          <Text variant="caption" color={status} numberOfLines={1}>
            {label}
          </Text>
        ) : null}
      </View>
    );
  }

  const value = count ?? 0;
  const display = value > max ? `${max}+` : String(value);

  return (
    <View className="h-20 min-w-20 items-center justify-center rounded-full bg-primary px-4">
      <Text variant="caption" color="on-primary" maxFontSizeMultiplier={1.3}>
        {display}
      </Text>
    </View>
  );
}
