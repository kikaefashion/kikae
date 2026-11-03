import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  /** Retry callback; errors that need action never auto-dismiss. */
  onRetry: () => void;
  retryLabel?: string;
  /** Optional "last updated" cue for manual-refresh surfaces. */
  lastUpdated?: string;
  icon?: IconName;
}

/**
 * Full-surface error state with a primary Retry action and an optional
 * "last updated" cue (components.md §4).
 */
export function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load this. Try again.",
  onRetry,
  retryLabel = 'Retry',
  lastUpdated,
  icon = 'alert-circle-outline',
}: ErrorStateProps) {
  return (
    <View className="items-center justify-center gap-12 px-16 py-32">
      <Icon name={icon} size={32} color="icon-muted" aria-hidden />
      <Text variant="headline" color="fg" className="text-center">
        {title}
      </Text>
      <Text variant="callout" color="fg-muted" className="text-center">
        {message}
      </Text>
      <Button variant="primary" onPress={onRetry}>
        {retryLabel}
      </Button>
      {lastUpdated ? (
        <Text variant="footnote" color="fg-muted" className="text-center">
          Last updated {lastUpdated}
        </Text>
      ) : null}
    </View>
  );
}
