import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export type EmptyStateVariant = 'default' | 'no-results';

const defaultIcon: Record<EmptyStateVariant, IconName> = {
  default: 'file-tray-outline',
  'no-results': 'search-outline',
};

export interface EmptyStateProps {
  /** Title (e.g. "No results for shoes"). */
  title: string;
  /** One-line hint below the title. */
  hint?: string;
  /** Optional leading icon (muted); defaults per variant. */
  icon?: IconName;
  /** `no-results` pairs with a "Clear filters" action by default. */
  variant?: EmptyStateVariant;
  /** Primary action label (e.g. "Browse", "Refresh", "Clear filters"). */
  actionLabel?: string;
  onActionPress?: () => void;
}

/**
 * Muted icon + title + one-line hint + optional primary action. The
 * `no-results` variant is for searches/filters and defaults its action label
 * to "Clear filters" (components.md §4).
 */
export function EmptyState({
  title,
  hint,
  icon,
  variant = 'default',
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  const resolvedAction =
    actionLabel ??
    (variant === 'no-results' && onActionPress ? 'Clear filters' : undefined);

  return (
    <View className="items-center justify-center gap-12 px-16 py-32">
      <Icon
        name={icon ?? defaultIcon[variant]}
        size={32}
        color="icon-muted"
        aria-hidden
      />
      <Text variant="headline" color="fg" className="text-center">
        {title}
      </Text>
      {hint ? (
        <Text variant="callout" color="fg-muted" className="text-center">
          {hint}
        </Text>
      ) : null}
      {resolvedAction && onActionPress ? (
        <Button variant="primary" onPress={onActionPress}>
          {resolvedAction}
        </Button>
      ) : null}
    </View>
  );
}
