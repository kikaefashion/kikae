import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { type Breakpoint, useBreakpoint } from '@/utils/layout';

/** Page margin by breakpoint (layout-system.md §2). */
const PAGE_MARGIN: Record<Breakpoint, number> = {
  base: 16,
  sm: 24,
  md: 24,
  lg: 32,
  xl: 32,
  '2xl': 40,
};

/** Max content width (content area only) by breakpoint (layout-system.md §2). */
const MAX_CONTENT_WIDTH: Record<Breakpoint, number | undefined> = {
  base: undefined,
  sm: undefined,
  md: undefined,
  lg: 1200,
  xl: 1280,
  '2xl': 1440,
};

/** Scrollable content area with the page margins and max width from the docs. */
export function ScreenLayout({ children }: { children: ReactNode }) {
  const breakpoint = useBreakpoint();
  const margin = PAGE_MARGIN[breakpoint];
  const maxWidth = MAX_CONTENT_WIDTH[breakpoint];

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{
        paddingHorizontal: margin,
        paddingVertical: margin,
      }}
    >
      <View
        style={[
          { width: '100%' },
          maxWidth ? { maxWidth, alignSelf: 'center' } : null,
        ]}
      >
        {children}
      </View>
    </ScrollView>
  );
}

/** Minimal stub screen: a heading plus an empty "Coming soon" state. */
export function ComingSoonScreen({ title }: { title: string }) {
  return (
    <ScreenLayout>
      <Text
        variant="title-1"
        color="fg"
        accessibilityRole="header"
        className="mb-16"
      >
        {title}
      </Text>
      <EmptyState title="Coming soon" />
    </ScreenLayout>
  );
}
