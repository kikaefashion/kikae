import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import type { StyleProp, ViewStyle } from 'react-native';

import { useSessionStatus } from '@/session/session-store';
import { useDesktopLayout } from '@/utils/layout';

import { getNavEntries, SIDEBAR_WIDTH } from './nav-config';
import { TabBar, TabItem } from './tab-bar';
import { TopBar } from './top-bar';

/**
 * The real app shell: a headless JS `Tabs` navigator with one branded,
 * monochrome tab bar. Below `lg` it renders a bottom tab bar; at `lg` and
 * wider it renders a fixed left sidebar and lets content scroll independently.
 */
export default function AppTabs() {
  const isDesktop = useDesktopLayout();
  const signedIn = useSessionStatus() === 'signedIn';
  const variant = isDesktop ? 'sidebar' : 'bottom';
  const entries = getNavEntries(signedIn);

  const contentStyle: StyleProp<ViewStyle> = isDesktop
    ? { flex: 1, marginLeft: SIDEBAR_WIDTH }
    : { flex: 1 };

  return (
    <Tabs>
      <TopBar isDesktop={isDesktop} />
      <TabSlot style={contentStyle} />
      <TabList asChild>
        <TabBar isDesktop={isDesktop}>
          {entries.map((entry) => (
            <TabTrigger
              key={entry.name}
              name={entry.name}
              href={entry.href}
              asChild
            >
              <TabItem
                label={entry.label}
                icon={entry.icon}
                iconOutline={entry.iconOutline}
                variant={variant}
              />
            </TabTrigger>
          ))}
        </TabBar>
      </TabList>
    </Tabs>
  );
}
