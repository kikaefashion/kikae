import { useIsFocused } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  AppState,
  FlatList,
  Platform,
  Pressable,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { clsx } from 'tailwind-variants';

import { focusRing, TOUCH_TARGET } from '@/components/ui/constants';
import { IconButton } from '@/components/ui/icon-button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { sizes } from '@/theme/tokens';

const AUTOPLAY_MS = 6000;

export interface CarouselSlide {
  id: string | number;
  title: string;
  text: string;
  imageUrl: string | null;
  /** Resolved route; null → shown but not tappable. */
  href: string | null;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  onSlidePress: (slide: CarouselSlide) => void;
}

function ratioOf(value: string): number {
  const [width, height] = value.split(':').map(Number);
  return width / height;
}

/**
 * Paged horizontal banner carousel. Autoplays every ~6s (pause/play button),
 * never under reduced motion, and stops after any user interaction; pauses when
 * the app is backgrounded or the route loses focus. Only the current and next
 * images are loaded. Title + text are overlaid on a solid scrim (the banner
 * images do not contain the text).
 */
export function Carousel({ slides, onSlidePress }: CarouselProps) {
  const { width: windowWidth } = useWindowDimensions();
  const focused = useIsFocused();
  const listRef = useRef<FlatList<CarouselSlide>>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');

  const ratioToken =
    windowWidth >= 768 ? sizes.image['banner-wide'] : sizes.image.banner;
  const ratio = ratioOf(ratioToken);
  const width = containerWidth || windowWidth;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setReducedMotion(value);
      })
      .catch(() => {
        if (mounted) setReducedMotion(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) =>
      setAppActive(state === 'active'),
    );
    return () => subscription.remove();
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      const count = slides.length;
      if (count === 0) return;
      const next = ((index % count) + count) % count;
      setActiveIndex(next);
      listRef.current?.scrollToOffset({ offset: next * width, animated: true });
    },
    [slides.length, width],
  );

  const goPrev = useCallback(() => {
    setPlaying(false);
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const goNext = useCallback(() => {
    setPlaying(false);
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  useEffect(() => {
    if (!playing || reducedMotion || !appActive || !focused || slides.length <= 1) {
      return;
    }
    const id = setInterval(() => {
      setActiveIndex((previous) => {
        const next = (previous + 1) % slides.length;
        listRef.current?.scrollToOffset({ offset: next * width, animated: true });
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [playing, reducedMotion, appActive, focused, slides.length, width]);

  // Keyboard navigation (web).
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goPrev, goNext]);

  if (slides.length === 0) return null;

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    if (width > 0) setActiveIndex(Math.round(offset / width));
  };

  return (
    <View className="gap-12">
      <View
        className="overflow-hidden rounded-lg"
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      >
        <FlatList
          ref={listRef}
          data={slides}
          horizontal
          pagingEnabled
          keyExtractor={(item) => String(item.id)}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => setPlaying(false)}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item, index }) => {
            const tappable = item.href != null;
            // Only the current and next images are loaded.
            const loadImage = index === activeIndex || index === activeIndex + 1;
            return (
              <Pressable
                accessibilityRole={tappable ? 'link' : undefined}
                accessibilityLabel={tappable ? item.title : undefined}
                disabled={!tappable}
                onPress={tappable ? () => onSlidePress(item) : undefined}
                className={tappable ? focusRing : undefined}
                style={{ width }}
              >
                <View style={{ aspectRatio: ratio }} className="relative">
                  <Image
                    source={loadImage ? item.imageUrl : null}
                    alt={item.title}
                    className="h-full w-full"
                  />
                  <View className="absolute inset-x-0 bottom-0 gap-4 bg-scrim px-16 py-12">
                    <Text variant="title-3" color="on-scrim" numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text variant="callout" color="on-scrim" numberOfLines={2}>
                      {item.text}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      {slides.length > 1 ? (
        <View className="flex-row items-center justify-center gap-12">
          <IconButton
            icon="chevron-back"
            label="Previous slide"
            onPress={goPrev}
          />
          <View className="flex-row items-center gap-8">
            {slides.map((slide, index) => (
              <Pressable
                key={String(slide.id)}
                accessibilityRole="button"
                accessibilityLabel={`Slide ${index + 1} of ${slides.length}`}
                accessibilityState={{ selected: index === activeIndex }}
                onPress={() => {
                  setPlaying(false);
                  goToIndex(index);
                }}
                className={clsx('items-center justify-center', focusRing)}
                style={{ width: TOUCH_TARGET, height: TOUCH_TARGET }}
              >
                <View
                  className={clsx(
                    'h-8 rounded-full',
                    index === activeIndex ? 'bg-primary' : 'bg-line',
                  )}
                  style={{ width: index === activeIndex ? 24 : 8 }}
                />
              </Pressable>
            ))}
          </View>
          <IconButton
            icon="chevron-forward"
            label="Next slide"
            onPress={goNext}
          />
          {!reducedMotion ? (
            <IconButton
              icon={playing ? 'pause' : 'play'}
              label={playing ? 'Pause autoplay' : 'Play autoplay'}
              onPress={() => setPlaying((value) => !value)}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
