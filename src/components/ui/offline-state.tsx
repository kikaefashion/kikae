import { useNetInfo } from '@react-native-community/netinfo';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

/**
 * Connectivity state backed by `@react-native-community/netinfo`. Screens use
 * this to decide when to render `OfflineState`, or to drive its `isConnected`
 * override in demos/tests.
 */
export function useConnectivity() {
  const { isConnected, isInternetReachable } = useNetInfo();
  return { isConnected, isInternetReachable };
}

export interface OfflineStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  retryLabel?: string;
  lastUpdated?: string;
  icon?: IconName;
  /** Override connectivity for demos/tests; defaults to NetInfo. */
  isConnected?: boolean | null;
}

/**
 * Offline state: explains what is cached vs needed, with a Retry action and a
 * "last updated" cue. Reads NetInfo connectivity and hides itself once the
 * connection returns (components.md §4).
 */
export function OfflineState({
  title = "You're offline",
  message = 'Showing cached content. Reconnect to get the latest.',
  onRetry,
  retryLabel = 'Retry',
  lastUpdated,
  icon = 'cloud-offline-outline',
  isConnected,
}: OfflineStateProps) {
  const netInfo = useNetInfo();
  const connected = isConnected ?? netInfo.isConnected;
  if (connected === true) return null;

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
