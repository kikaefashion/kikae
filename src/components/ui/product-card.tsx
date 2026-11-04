import { Link, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { clsx } from 'tailwind-variants';

import { focusRing } from '@/components/ui/constants';
import { IconButton } from '@/components/ui/icon-button';
import { Icon } from '@/components/ui/icon';
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
  madeInNigeria: boolean | undefined;
  rating: number | null;
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
 * Uniform 4:5 product card: image, name, store, price (with optional
 * strikethrough old price), rating, and up to two image overlays (badges +
 * "Sold out"). The card is a link to `/product/[id]`; the wishlist heart is a
 * sibling `IconButton` (never nested inside the link).
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

  return (
    <View style={width ? { width } : { flex: 1 }}>
      <View className="relative">
        <Link href={`/product/${product.id}` as Href} asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`${product.name}, ${priceLabel}`}
            className={clsx('rounded-lg', focusRing)}
          >
            <View className="relative">
              <Image
                source={product.imageUrl}
                alt={product.name}
                className="w-full rounded-lg"
                style={{ aspectRatio: CARD_ASPECT }}
              />
              {(product.thrift || product.madeInNigeria) && (
                <View className="absolute left-8 top-8 flex-row flex-wrap gap-4">
                  {product.thrift ? <OverlayLabel>Thrift</OverlayLabel> : null}
                  {product.madeInNigeria ? (
                    <OverlayLabel>Made in Nigeria</OverlayLabel>
                  ) : null}
                </View>
              )}
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
              {product.rating != null ? (
                <View className="flex-row items-center gap-4">
                  <Icon name="star" size={16} color="warning" aria-hidden />
                  <Text variant="caption" color="fg-muted">
                    {product.rating.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        </Link>
        <View className="absolute right-8 top-8">
          <IconButton
            icon={liked ? 'heart' : 'heart-outline'}
            label={liked ? 'Saved' : 'Add to wishlist'}
            disabled={liked || saving}
            onPress={onLikePress}
          />
        </View>
      </View>
    </View>
  );
}
