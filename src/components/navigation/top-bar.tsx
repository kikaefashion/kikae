import { router, usePathname, type Href } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/icon-button';
import { type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { requireAuth } from '@/features/auth/require-auth';
import { useSessionStatus } from '@/session/session-store';

import { TOP_BAR_HEIGHT } from './nav-config';

interface BadgedIconProps {
  icon: IconName;
  label: string;
  count: number;
  onPress: () => void;
}

function BadgedIcon({ icon, label, count, onPress }: BadgedIconProps) {
  return (
    <View className="relative">
      <IconButton icon={icon} label={label} onPress={onPress} />
      {count > 0 ? (
        <View pointerEvents="none" className="absolute right-0 top-0">
          <Badge count={count} />
        </View>
      ) : null}
    </View>
  );
}

export interface TopBarProps {
  isDesktop?: boolean;
  cartCount?: number;
  notificationCount?: number;
}

/**
 * Persistent app chrome: wordmark, Search, Cart (badge) and Notifications
 * (badge). Desktop adds the account entry. Cart/Notifications require auth.
 */
export function TopBar({
  isDesktop = false,
  cartCount = 0,
  notificationCount = 0,
}: TopBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const signedIn = useSessionStatus() === 'signedIn';
  const height =
    (isDesktop ? TOP_BAR_HEIGHT.desktop : TOP_BAR_HEIGHT.mobile) + insets.top;

  const openProtected = (target: Href) => {
    router.push(requireAuth(target, signedIn, pathname));
  };

  return (
    <View
      className="flex-row items-center justify-between border-b border-line bg-surface px-16"
      style={{ minHeight: height, paddingTop: insets.top }}
    >
      <Text variant="title-3" weight="bold" color="fg" numberOfLines={1}>
        Kikae
      </Text>
      <View className="flex-row items-center gap-8">
        <IconButton
          icon="search-outline"
          label="Search"
          onPress={() => router.push('/discover' as Href)}
        />
        <BadgedIcon
          icon="cart-outline"
          label="Cart"
          count={cartCount}
          onPress={() => openProtected('/cart' as Href)}
        />
        <BadgedIcon
          icon="notifications-outline"
          label="Notifications"
          count={notificationCount}
          onPress={() => openProtected('/notifications' as Href)}
        />
        {isDesktop ? (
          <IconButton
            icon="person-circle-outline"
            label="Account"
            onPress={() => router.push('/profile' as Href)}
          />
        ) : null}
      </View>
    </View>
  );
}
