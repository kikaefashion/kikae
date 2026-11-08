import { forwardRef, type ElementRef, type ReactNode } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clsx } from 'tailwind-variants';

import { focusRing, TOUCH_TARGET } from '@/components/ui/constants';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import { SIDEBAR_WIDTH, TAB_BAR_HEIGHT, TOP_BAR_HEIGHT } from './nav-config';

export type TabItemVariant = 'bottom' | 'sidebar';

export interface TabItemProps {
  label: string;
  icon: IconName;
  iconOutline: IconName;
  isFocused?: boolean;
  onPress?: PressableProps['onPress'];
  onLongPress?: PressableProps['onLongPress'];
  /** `bottom` stretches across the bar; `sidebar` is a fixed-height row. */
  variant?: TabItemVariant;
}

/**
 * A single tab entry. Renders a filled icon + `fg` label when active and an
 * outline icon + `fg-muted` label when inactive (components.md §3).
 */
export const TabItem = forwardRef<ElementRef<typeof Pressable>, TabItemProps>(
  function TabItem(
    {
      label,
      icon,
      iconOutline,
      isFocused = false,
      onPress,
      onLongPress,
      variant = 'bottom',
    },
    ref,
  ) {
    return (
      <Pressable
        ref={ref}
        accessibilityRole="tab"
        accessibilityLabel={label}
        accessibilityState={{ selected: isFocused }}
        onPress={onPress}
        onLongPress={onLongPress}
        className={clsx(
          'items-center justify-center gap-4',
          variant === 'bottom' ? 'flex-1' : 'w-full',
          focusRing,
        )}
        style={({ pressed }) => [
          variant === 'sidebar' ? { minHeight: TOUCH_TARGET } : null,
          pressed ? { opacity: 0.7 } : null,
        ]}
      >
        <Icon
          name={isFocused ? icon : iconOutline}
          size={24}
          color={isFocused ? 'icon' : 'icon-muted'}
          aria-hidden
        />
        <Text
          variant="caption"
          color={isFocused ? 'fg' : 'fg-muted'}
          maxFontSizeMultiplier={1.3}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    );
  },
);

export const BottomTabBar = forwardRef<
  ElementRef<typeof View>,
  { children: ReactNode }
>(function BottomTabBar({ children }, ref) {
  const insets = useSafeAreaInsets();
  return (
    <View
      ref={ref}
      accessibilityRole="tablist"
      className="items-stretch border-t border-line bg-surface"
      style={{
        flexDirection: 'row',
        paddingBottom: insets.bottom,
        minHeight: TAB_BAR_HEIGHT + insets.bottom,
      }}
    >
      {children}
    </View>
  );
});

export const Sidebar = forwardRef<
  ElementRef<typeof View>,
  { children: ReactNode }
>(function Sidebar({ children }, ref) {
  const insets = useSafeAreaInsets();
  return (
    <View
      ref={ref}
      accessibilityRole="tablist"
      className="border-r border-line bg-surface py-8"
      style={{
        position: 'absolute',
        left: 0,
        top: TOP_BAR_HEIGHT.desktop + insets.top,
        bottom: 0,
        width: SIDEBAR_WIDTH,
      }}
    >
      {children}
    </View>
  );
});

export interface TabBarProps {
  isDesktop: boolean;
  children: ReactNode;
}

/** Renders the bottom tab bar below `lg`, or the fixed sidebar at `lg`+. */
export const TabBar = forwardRef<ElementRef<typeof View>, TabBarProps>(
  function TabBar({ isDesktop, children }, ref) {
    return isDesktop ? (
      <Sidebar ref={ref}>{children}</Sidebar>
    ) : (
      <BottomTabBar ref={ref}>{children}</BottomTabBar>
    );
  },
);
