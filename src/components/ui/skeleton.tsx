import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, View } from 'react-native';

import { sizes } from '@/theme/tokens';

export type SkeletonShape =
  'text' | 'card' | 'row' | 'banner' | 'section-header';

function aspectRatio(ratio: string): number {
  const [width, height] = ratio.split(':').map(Number);
  return width / height;
}

const cardAspectRatio = aspectRatio(sizes.image.card);
const bannerAspectRatio = aspectRatio(sizes.image.banner);

export interface SkeletonProps {
  /** Shape matching the final layout exactly (components.md §2). */
  shape?: SkeletonShape;
  /** Number of text lines (default 2, 60–90% width). */
  lines?: number;
  className?: string;
}

/**
 * Neutral `skeleton` placeholder with a gentle opacity pulse that respects the
 * reduced-motion setting. Used for first paints — never a bare spinner.
 */
export function Skeleton({
  shape = 'text',
  lines = 2,
  className,
}: SkeletonProps) {
  const [opacity] = useState(() => new Animated.Value(0.6));
  // Assume reduced motion until the system reports otherwise, so the pulse
  // never starts for reduced-motion users (and never leaks a timer in tests).
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduced) => {
        if (mounted) setReducedMotion(reduced);
      })
      .catch(() => {
        if (mounted) setReducedMotion(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      opacity.setValue(0.6);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, reducedMotion]);

  return (
    <Animated.View
      style={{ opacity }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      className={className}
    >
      {renderShape(shape, lines)}
    </Animated.View>
  );
}

function renderShape(shape: SkeletonShape, lines: number) {
  switch (shape) {
    case 'text':
      return (
        <View className="gap-8">
          {Array.from({ length: lines }).map((_, index) => (
            <View
              key={index}
              className="h-16 rounded-xs bg-skeleton"
              style={{ width: index === lines - 1 ? '60%' : '85%' }}
            />
          ))}
        </View>
      );

    case 'card':
      return (
        <View className="gap-8">
          <View
            className="rounded-lg bg-skeleton"
            style={{ aspectRatio: cardAspectRatio }}
          />
          <View className="h-16 w-3/4 rounded-xs bg-skeleton" />
          <View className="h-16 w-1/2 rounded-xs bg-skeleton" />
        </View>
      );

    case 'row':
      return (
        <View className="flex-row items-center gap-8">
          <View className="h-40 w-40 rounded-full bg-skeleton" />
          <View className="flex-1 gap-8">
            <View className="h-16 w-3/4 rounded-xs bg-skeleton" />
            <View className="h-16 w-1/2 rounded-xs bg-skeleton" />
          </View>
        </View>
      );

    case 'banner':
      return (
        <View
          className="rounded-lg bg-skeleton"
          style={{ aspectRatio: bannerAspectRatio }}
        />
      );

    case 'section-header':
      return <View className="h-24 w-2/5 rounded-xs bg-skeleton" />;
  }
}
