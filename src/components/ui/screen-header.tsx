import { router, useCanGoBack, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';

export interface ScreenHeaderProps {
  /** Optional heading; omit when the screen renders its own `h1`. */
  title?: string;
  /** Optional trailing actions (e.g. a wishlist heart). */
  right?: ReactNode;
}

/**
 * Slim page header: a labelled back button (previous history, else Home) and an
 * optional title and right actions. The back arrow is an `arrow-back` Ionicons
 * glyph (mirrored in RTL by the icon set).
 */
export function ScreenHeader({ title, right }: ScreenHeaderProps) {
  const canGoBack = useCanGoBack();

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.replace('/' as Href);
    }
  };

  return (
    <View className="flex-row items-center justify-between gap-12 px-16 py-8">
      <View className="flex-1 flex-row items-center gap-8">
        <IconButton icon="arrow-back" label="Back" onPress={handleBack} />
        {title ? (
          <Text
            variant="title-3"
            color="fg"
            numberOfLines={1}
            className="flex-1"
          >
            {title}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}
