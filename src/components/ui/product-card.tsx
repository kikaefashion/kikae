import { Link, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Image } from '@/components/ui/image';
import { Price } from '@/components/ui/price';
import { Text } from '@/components/ui/text';
import { sizes } from '@/theme/tokens';
import { formatNaira } from '@/utils/format-naira';

const CARD_ASPECT = (() => {
  const [width, height] = sizes.image.card.split(':').map(Number);
  return width / height;
})();

export interface ProductCardProduct {
  id: string | number;
  name: string;
  storeName: string;
  price: number;
  oldPrice: number | null;
  units: number;
  thrift: boolean | null;
  /** Individual ratings; the summary is derived from this array. */
  ratings: { rating: number }[];
  imageUrl: string | null;
}

export interface ProductCardProps {
  product: ProductCardProduct;
  /** True when the current user has already saved this product (add-only). */
  liked?: boolean;
  /** True while a like request is in flight. */
  saving?: boolean;
  onLikePress?: () => void;
  /** Fixed card width for horizontal rails. */
  width?: number;
}

function OverlayLabel({ children }: { children: ReactNode }) {
  return (
    <View className="rounded-full bg-surface px-8 py-4">
      <Text variant="caption" color="fg" maxFontSizeMultiplier={1.3}>
        {children}
      </Text>
    </View>
  );
}

/**
 * Rating summary exactly as the legacy card computed it: the rounded average of
 * `ratings[].rating`, shown only when ratings exist. The rating field shape is
 * UNVERIFIED (all samples have empty `ratings` arrays) — copied from the old
 * `ShirtCard` and guarded so it can never be NaN.
 */
function averageRating(ratings: { rating: number }[]): number | null {
  if (ratings.length === 0) return null;
  const sum = ratings.reduce((acc, entry) => acc + entry.rating, 0);
  return Math.round(sum / ratings.length);
}

/**
 * Uniform 4:5 product card. The card link wraps the image, name and store; the
 * price row (price left, wishlist heart right) and rating are siblings so the
 * heart stays outside the link. The only badge is Thrift; "Sold out" overlays
 * when `units` is 0.
 */
export function ProductCard({
  product,
  liked = false,
  saving = false,
  onLikePress,
  width,
}: ProductCardProps) {
  const soldOut = product.units === 0;
  const free = product.price === 0;
  const priceLabel = free ? 'Free' : formatNaira(product.price);
  const oldPrice =
    product.oldPrice != null && product.oldPrice > product.price
      ? product.oldPrice
      : null;
  const rating = averageRating(product.ratings);

  return (
    <View style={width ? { width } : { flex: 1 }}>
      <Link href={`/product/${product.id}` as Href} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${product.name}, ${priceLabel}`}
        >
          <View className="relative">
            <Image
              source={product.imageUrl}
              alt={product.name}
              className="w-full rounded-lg"
              style={{ aspectRatio: CARD_ASPECT }}
            />
            {product.thrift ? (
              <View className="absolute left-8 top-8">
                <OverlayLabel>Thrift</OverlayLabel>
              </View>
            ) : null}
            {soldOut ? (
              <View className="absolute inset-0 items-center justify-center">
                <OverlayLabel>Sold out</OverlayLabel>
              </View>
            ) : null}
          </View>
          <View className="gap-4 pt-8">
            <Text variant="subhead" color="fg" numberOfLines={2}>
              {product.name}
            </Text>
            <Text variant="caption" color="fg-muted" numberOfLines={1}>
              {product.storeName}
            </Text>
          </View>
        </Pressable>
      </Link>

      <View className="flex-row items-center justify-between pt-8">
        <View className="flex-row items-baseline gap-8">
          {free ? (
            <Text variant="subhead" color="fg" weight="bold">
              Free
            </Text>
          ) : (
            <Price amount={product.price} emphasis variant="subhead" />
          )}
          {oldPrice != null ? (
            <Text
              variant="caption"
              color="fg-muted"
              style={{ textDecorationLine: 'line-through' }}
            >
              {formatNaira(oldPrice)}
            </Text>
          ) : null}
        </View>
        <IconButton
          icon={liked ? 'heart' : 'heart-outline'}
          label={liked ? 'Saved' : 'Add to wishlist'}
          disabled={liked || saving}
          onPress={onLikePress}
        />
      </View>

      {rating != null ? (
        <View className="flex-row items-center gap-4 pt-8">
          <Icon name="star" size={16} color="warning" aria-hidden />
          <Text variant="caption" color="fg-muted">
            {rating}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
