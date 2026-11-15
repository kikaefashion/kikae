import { useEffect, useRef, useState, type ElementRef } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { clsx } from 'tailwind-variants';

import { focusRing, TOUCH_TARGET } from '@/components/ui/constants';
import { IconButton } from '@/components/ui/icon-button';
import { Image } from '@/components/ui/image';
import { sizes } from '@/theme/tokens';
import { mediaUrl } from '@/utils/media-url';

export interface GalleryImage {
  url: string | null;
}

export interface GalleryProps {
  images: GalleryImage[];
  /** Accessible name for the gallery (the product name). */
  alt: string;
}

/** Stable 4:5 card ratio (`img-card`) used by the main image frame. */
const CARD_ASPECT = (() => {
  const [width, height] = sizes.image.card.split(':').map(Number);
  return width / height;
})();

const THUMBNAIL_SIZE = 72;
const DESKTOP_BREAKPOINT = 1024;

/**
 * Product gallery. Desktop (`lg`+): a 4:5 main frame (surface, rounded, 1px
 * border, `contain`) plus a horizontal strip of 72px thumbnails. Phone: a swipe
 * pager sized from the container's measured width (not the window), with
 * labelled dots and prev/next buttons, and left/right arrow keys on web. First
 * image eager, the rest lazy; a neutral placeholder when empty.
 */
export function Gallery({ images, alt }: GalleryProps) {
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const [index, setIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const listRef = useRef<FlatList<string>>(null);
  const pagerRef = useRef<ElementRef<typeof View>>(null);

  const urls = images
    .map((image) => mediaUrl(image.url))
    .filter((url): url is string => url != null);

  const pageWidth = containerWidth || width;
  const active = Math.min(index, Math.max(0, urls.length - 1));

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(0, next), Math.max(0, urls.length - 1));
    setIndex(clamped);
    listRef.current?.scrollToOffset({
      offset: clamped * pageWidth,
      animated: true,
    });
  };

  // Web-only left/right arrow keys for the phone pager.
  useEffect(() => {
    if (Platform.OS !== 'web' || isDesktop) return;
    const node = pagerRef.current as unknown as HTMLElement | null;
    if (!node) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goTo(active - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goTo(active + 1);
      }
    };
    node.addEventListener('keydown', onKey);
    return () => node.removeEventListener('keydown', onKey);
  }, [isDesktop, active, urls.length, pageWidth]);

  if (urls.length === 0) {
    return (
      <Image
        source={null}
        alt={alt}
        contentFit="contain"
        className="w-full rounded-lg border border-line"
        style={{ aspectRatio: CARD_ASPECT }}
      />
    );
  }

  if (isDesktop) {
    return (
      <View className="gap-16">
        <View
          className="overflow-hidden rounded-lg border border-line bg-surface"
          style={{ aspectRatio: CARD_ASPECT, maxHeight: height * 0.8 }}
        >
          <Image
            source={urls[active]}
            alt={`${alt} image ${active + 1} of ${urls.length}`}
            contentFit="contain"
            loading="eager"
            className="h-full w-full"
          />
        </View>
        {urls.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {urls.map((url, i) => (
              <Pressable
                key={url}
                accessibilityRole="button"
                accessibilityLabel={`Show image ${i + 1} of ${urls.length}`}
                accessibilityState={{ selected: i === active }}
                onPress={() => setIndex(i)}
                className={clsx('rounded-md', focusRing)}
              >
                <Image
                  source={url}
                  alt=""
                  contentFit="cover"
                  loading="lazy"
                  className={clsx(
                    'rounded-md',
                    i === active && 'border-2 border-primary',
                  )}
                  style={{ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE }}
                />
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
      </View>
    );
  }

  return (
    <View
      ref={pagerRef}
      tabIndex={0}
      accessibilityRole="group"
      accessibilityLabel={`${alt} gallery`}
      onLayout={(event: LayoutChangeEvent) =>
        setContainerWidth(event.nativeEvent.layout.width)
      }
    >
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        data={urls}
        keyExtractor={(url) => url}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={1}
        windowSize={3}
        onMomentumScrollEnd={(
          event: NativeSyntheticEvent<NativeScrollEvent>,
        ) => {
          setIndex(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
        }}
        renderItem={({ item, index: i }) => (
          <View style={{ width: pageWidth }}>
            <View
              className="overflow-hidden rounded-lg border border-line bg-surface"
              style={{ aspectRatio: CARD_ASPECT }}
            >
              <Image
                source={item}
                alt={`${alt} image ${i + 1} of ${urls.length}`}
                contentFit="contain"
                loading={i === 0 ? 'eager' : 'lazy'}
                className="h-full w-full"
              />
            </View>
          </View>
        )}
      />
      {urls.length > 1 ? (
        <View className="flex-row items-center justify-center gap-8 py-8">
          <IconButton
            icon="chevron-back"
            label="Previous image"
            disabled={active === 0}
            onPress={() => goTo(active - 1)}
          />
          <View className="flex-row items-center gap-8">
            {urls.map((url, i) => (
              <Pressable
                key={url}
                accessibilityRole="button"
                accessibilityLabel={`Image ${i + 1} of ${urls.length}`}
                accessibilityState={{ selected: i === active }}
                onPress={() => goTo(i)}
                className={clsx('items-center justify-center', focusRing)}
                style={{ width: TOUCH_TARGET, height: TOUCH_TARGET }}
              >
                <View
                  className={clsx(
                    'h-8 rounded-full',
                    i === active ? 'bg-primary' : 'bg-line',
                  )}
                  style={{ width: i === active ? 24 : 8 }}
                />
              </Pressable>
            ))}
          </View>
          <IconButton
            icon="chevron-forward"
            label="Next image"
            disabled={active === urls.length - 1}
            onPress={() => goTo(active + 1)}
          />
        </View>
      ) : null}
    </View>
  );
}
