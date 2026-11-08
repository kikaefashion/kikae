import { Image as ExpoImage } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { clsx } from 'tailwind-variants';

import { Icon } from '@/components/ui/icon';

export type ImageContentFit = 'cover' | 'contain';

export interface ImageProps {
  /** Resolved image URL; null/empty renders the error fallback. */
  source: string | null | undefined;
  /** Accessible name for the image. */
  alt: string;
  /** Content fit; default cover. */
  contentFit?: ImageContentFit;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Theme-aware image over `expo-image`: a `skeleton` placeholder behind the
 * image while it loads, an error fallback when the source is missing or fails,
 * and memory + disk caching.
 */
export function Image({
  source,
  alt,
  contentFit = 'cover',
  className,
  style,
}: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return (
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`${alt} unavailable`}
        className={clsx('items-center justify-center bg-skeleton', className)}
        style={style}
      >
        <Icon name="image-outline" size={24} color="icon-muted" aria-hidden />
      </View>
    );
  }

  return (
    <View className={clsx('overflow-hidden bg-skeleton', className)} style={style}>
      <ExpoImage
        source={{ uri: source }}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        onError={() => setFailed(true)}
        style={StyleSheet.absoluteFill}
        accessibilityLabel={alt}
      />
    </View>
  );
}
