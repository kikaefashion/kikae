import { Pressable, View } from 'react-native';
import { clsx } from 'tailwind-variants';

import { type TextColor } from '@/components/ui/colors';
import { focusRing, TOUCH_TARGET } from '@/components/ui/constants';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export type InlineBannerStatus = 'offline' | 'pending' | 'error' | 'info';

const statusIcon: Record<InlineBannerStatus, IconName> = {
  offline: 'cloud-offline-outline',
  pending: 'time-outline',
  error: 'alert-circle',
  info: 'information-circle',
};

const statusColor: Record<InlineBannerStatus, TextColor> = {
  offline: 'info',
  pending: 'warning',
  error: 'error',
  info: 'info',
};

export interface InlineBannerProps {
  /** Ongoing state (components.md §4); persistent and never auto-dismisses. */
  status: InlineBannerStatus;
  /** Main status label (e.g. "You're offline"). */
  label: string;
  /** Optional leading icon; defaults to a status-specific icon. */
  icon?: IconName;
  /** Optional action label; renders a 44px pressable. */
  actionLabel?: string;
  onActionPress?: () => void;
}

/**
 * Persistent, non-modal status strip (icon + label + optional action) for
 * ongoing states such as offline or "awaiting approval". Does not auto-dismiss.
 */
export function InlineBanner({
  status,
  label,
  icon,
  actionLabel,
  onActionPress,
}: InlineBannerProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      className="flex-row items-center gap-12 rounded-md border border-line bg-surface p-16"
    >
      <Icon
        name={icon ?? statusIcon[status]}
        size={20}
        color={statusColor[status]}
        aria-hidden
      />
      <Text variant="callout" color="fg" className="flex-1">
        {label}
      </Text>
      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onActionPress}
          className={clsx('items-center justify-center px-8', focusRing)}
          style={({ pressed }) => [
            { minHeight: TOUCH_TARGET, minWidth: TOUCH_TARGET },
            pressed ? { opacity: 0.7 } : null,
          ]}
        >
          <Text
            variant="callout"
            color="fg"
            weight="medium"
            maxFontSizeMultiplier={1.3}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
