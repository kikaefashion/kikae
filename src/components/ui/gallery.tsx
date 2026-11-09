import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { clsx } from 'tailwind-variants';

import { focusRing } from '@/components/ui/constants';
import { IconButton } from '@/components/ui/icon-button';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { mediaUrl } from '@/utils/media-url';

export interface GalleryImage {
  url: string | null;
}

export interface GalleryProps {
  images: GalleryImage[];
  /** Accessible name for the gallery (the product name). */
  alt: string;
}

/**
 * Product gallery. Phone: a swipe pager with labelled dots ("Image 2 of 5") and
 * prev/next buttons (the non-swipe alternative). Desktop (`lg`+): a large image
 * plus a thumbnail strip. First image eager, the rest lazy; original URLs; a
 * skeleton placeholder behind each image; a neutral placeholder when empty.
 */
export function Gallery({ images, alt }: GalleryProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<string>>(null);

  const urls = images
    .map((image) => mediaUrl(image.url))
    .filter((url): url is string => url != null);

  if (urls.length === 0) {
    return (
      <Image
        source={null}
        alt={alt}
        contentFit="cover"
        className="aspect-square w-full rounded-lg"
      />
    );
  }

  const active = Math.min(index, urls.length - 1);
  const goTo = (next: number) => {
    setIndex(next);
    listRef.current?.scrollToOffset({ offset: next * width, animated: true });
  };

  if (isDesktop) {
    return (
      <View className="flex-row gap-16">
        <View className="flex-1">
          <Image
            source={urls[active]}
            alt={`${alt} image ${active + 1} of ${urls.length}`}
            contentFit="cover"
            className="aspect-square w-full rounded-lg"
          />
        </View>
        <View className="gap-8">
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
                className={clsx(
                  'h-64 w-64 rounded-md',
                  i === active && 'border-2 border-primary',
                )}
              />
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View>
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
          setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item, index: i }) => (
          <View style={{ width }}>
            <Image
              source={item}
              alt={`${alt} image ${i + 1} of ${urls.length}`}
              contentFit="cover"
              className="aspect-square w-full"
            />
          </View>
        )}
      />
      <View className="flex-row items-center justify-center gap-8 py-8">
        <IconButton
          icon="chevron-back"
          label="Previous image"
          disabled={active === 0}
          onPress={() => goTo(Math.max(0, active - 1))}
        />
        <Text variant="caption" color="fg-muted">
          Image {active + 1} of {urls.length}
        </Text>
        <IconButton
          icon="chevron-forward"
          label="Next image"
          disabled={active === urls.length - 1}
          onPress={() => goTo(Math.min(urls.length - 1, active + 1))}
        />
      </View>
    </View>
  );
}
