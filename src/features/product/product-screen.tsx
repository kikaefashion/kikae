import {
  Link,
  router,
  useLocalSearchParams,
  usePathname,
  type Href,
} from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { trackProductView, type ProductDetail } from '@/api/endpoints/product';
import { getUserId } from '@/api/identity';
import { useCart } from '@/api/queries/use-cart';
import { useProduct } from '@/api/queries/use-product';
import { capabilities } from '@/config/capabilities';
import { DocumentTitle } from '@/components/document-title';
import { Badge } from '@/components/ui/badge';
import { TOUCH_TARGET } from '@/components/ui/constants';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Gallery } from '@/components/ui/gallery';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Image } from '@/components/ui/image';
import { InlineBanner } from '@/components/ui/inline-banner';
import { useConnectivity } from '@/components/ui/offline-state';
import { Price } from '@/components/ui/price';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { TagList } from '@/components/ui/tag-list';
import { Text } from '@/components/ui/text';
import { requireAuth, resolveHeartAction } from '@/features/auth/require-auth';
import { useSessionStatus } from '@/session/session-store';
import { formatNaira } from '@/utils/format-naira';
import { useDesktopLayout } from '@/utils/layout';
import { mediaUrl } from '@/utils/media-url';

import { isLikedBy } from '@/features/home/selectors';
import { useLikeProduct } from '@/features/home/use-like-product';
import { ProductActionArea, SizeColourPicker } from './product-action-area';
import { averageRating, buyNowPath, remainingStockForProduct, stockLabel } from './selectors';
import { useAddToCart } from './use-add-to-cart';

function ProductSkeleton() {
  return (
    <View className="gap-16 p-16">
      <Skeleton shape="card" />
      <Skeleton shape="text" lines={2} />
      <Skeleton shape="text" lines={1} />
      <Skeleton shape="text" lines={3} />
    </View>
  );
}

function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = text.length > 120;

  return (
    <View className="gap-8">
      <Text
        variant="callout"
        color="fg-muted"
        numberOfLines={expanded ? undefined : 3}
      >
        {text}
      </Text>
      {collapsible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            expanded ? 'Show less description' : 'Show more description'
          }
          onPress={() => setExpanded((value) => !value)}
          className="justify-center self-start px-8"
          style={{ minHeight: TOUCH_TARGET }}
        >
          <Text variant="callout" color="fg" weight="medium">
            {expanded ? 'Show less' : 'Show more'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ProductContent({
  product,
  userId,
  offline,
  onRetry,
  cartEnabled,
  sizeId,
  colorId,
  onSizeChange,
  onColorChange,
  showSizeError,
  showColorError,
  actionArea,
}: {
  product: ProductDetail;
  userId: string | number | null;
  offline: boolean;
  onRetry: () => void;
  cartEnabled: boolean;
  sizeId: string | number | null;
  colorId: string | number | null;
  onSizeChange: (id: string | number) => void;
  onColorChange: (id: string | number) => void;
  showSizeError: boolean;
  showColorError: boolean;
  actionArea: ReactNode;
}) {
  const free = product.price === 0;
  const oldPrice =
    product.old_price != null && product.old_price > product.price
      ? product.old_price
      : null;
  const stock = stockLabel(product.units);
  const rating = averageRating(product.ratings);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {offline ? (
        <InlineBanner
          status="offline"
          label="You're offline — showing saved product"
          actionLabel="Retry"
          onActionPress={onRetry}
        />
      ) : null}

      <Gallery images={product.media} alt={product.name} />

      <View className="gap-8">
        <Text variant="title-1" color="fg" accessibilityRole="header">
          {product.name}
        </Text>
        {product.thrift ? (
          <Badge status="info" label="Thrift" icon="pricetag-outline" />
        ) : null}
        {stock ? (
          <Text
            variant="callout"
            color={product.units === 0 ? 'error' : 'fg-muted'}
          >
            {stock}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-baseline gap-8">
        {free ? (
          <Text variant="title-2" color="fg" weight="bold">
            Free
          </Text>
        ) : (
          <Price amount={product.price} emphasis variant="title-2" />
        )}
        {oldPrice != null ? (
          <Text
            variant="callout"
            color="fg-muted"
            style={{ textDecorationLine: 'line-through' }}
          >
            {formatNaira(oldPrice)}
          </Text>
        ) : null}
      </View>

      {!product.isMakeup ? (
        cartEnabled ? (
          <SizeColourPicker
            sizes={product.sizes}
            colours={product.colours}
            sizeId={sizeId}
            colorId={colorId}
            onSizeChange={onSizeChange}
            onColorChange={onColorChange}
            showSizeError={showSizeError}
            showColorError={showColorError}
          />
        ) : (
          <>
            <TagList
              label="Available in sizes"
              values={product.sizes.map((size) => size.size)}
            />
            <TagList
              label="Available in colours"
              values={product.colours.map((colour) => colour.name)}
            />
          </>
        )
      ) : null}

      {product.description ? (
        <ExpandableDescription text={product.description} />
      ) : null}

      {product.store ? (
        <Link href={`/store/${product.store.id}` as Href} asChild>
          <Pressable
            accessibilityRole="link"
            className="flex-row items-center gap-12 self-start"
          >
            <Image
              source={mediaUrl(product.store.logo)}
              alt={product.store.name}
              contentFit="cover"
              className="h-40 w-40 rounded-full"
            />
            <Text variant="subhead" color="fg">
              {product.store.name}
            </Text>
          </Pressable>
        </Link>
      ) : null}

      {rating != null ? (
        <View className="flex-row items-center gap-4">
          <Icon name="star" size={16} color="warning" aria-hidden />
          <Text variant="caption" color="fg-muted">
            {rating}
          </Text>
        </View>
      ) : null}

      {product.isMakeup ? (
        <View className="gap-8">
          <Text variant="title-3" color="fg">
            Makeup service
          </Text>
          <Text variant="callout" color="fg-muted">
            Availability: {product.offer ?? 'not set'}
          </Text>
          <Text variant="callout" color="fg-muted">
            Booking isn&apos;t available in the app yet
          </Text>
          {product.coverages.map((coverage) => (
            <View
              key={coverage.area}
              className="flex-row items-center justify-between"
            >
              <Text variant="callout" color="fg">
                {coverage.area}
              </Text>
              <Price amount={coverage.fee} variant="callout" />
            </View>
          ))}
          {product.availability.map((slot) => (
            <Text key={slot.dated} variant="callout" color="fg-muted">
              {slot.dated}
              {slot.available ? '' : ' (unavailable)'}
            </Text>
          ))}
        </View>
      ) : null}

      {actionArea}
    </ScrollView>
  );
}

function PurchasableProduct({
  product,
  userId,
  offline,
  onRetry,
}: {
  product: ProductDetail;
  userId: string | number | null;
  offline: boolean;
  onRetry: () => void;
}) {
  const isDesktop = useDesktopLayout();
  const pathname = usePathname();
  const status = useSessionStatus();
  const [sizeId, setSizeId] = useState<string | number | null>(null);
  const [colorId, setColorId] = useState<string | number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  const addToCart = useAddToCart();
  const cart = useCart();
  const remaining = remainingStockForProduct(
    cart.data ?? [],
    product.id,
    product.units,
  );

  const needsSize = product.sizes.length > 0;
  const needsColor = product.colours.length > 0;
  const signedIn = status === 'signedIn';

  const handleAddToCart = () => {
    if (!signedIn) {
      router.push(requireAuth(`/product/${product.id}` as Href, false, pathname));
      return;
    }
    if ((needsSize && sizeId == null) || (needsColor && colorId == null)) {
      setShowValidation(true);
      return;
    }
    addToCart.mutate({
      product,
      sizeId: sizeId ?? 0,
      colorId: colorId ?? 0,
      units: quantity,
    });
  };

  const handleGetForFree = () => {
    if (!signedIn) {
      router.push(requireAuth(`/product/${product.id}` as Href, false, pathname));
      return;
    }
    if ((needsSize && sizeId == null) || (needsColor && colorId == null)) {
      setShowValidation(true);
      return;
    }
    router.push(buyNowPath(product.id, sizeId, colorId) as Href);
  };

  const actionArea = capabilities.cartEnabled ? (
    <ProductActionArea
      product={product}
      quantity={quantity}
      remaining={remaining}
      pending={addToCart.isPending}
      onQuantityChange={setQuantity}
      onAddToCart={handleAddToCart}
      onGetForFree={handleGetForFree}
    />
  ) : null;

  return (
    <View className="flex-1">
      <ProductContent
        product={product}
        userId={userId}
        offline={offline}
        onRetry={onRetry}
        cartEnabled={capabilities.cartEnabled}
        sizeId={sizeId}
        colorId={colorId}
        onSizeChange={setSizeId}
        onColorChange={setColorId}
        showSizeError={showValidation && needsSize && sizeId == null}
        showColorError={showValidation && needsColor && colorId == null}
        actionArea={isDesktop ? actionArea : null}
      />
      {!isDesktop ? actionArea : null}
    </View>
  );
}

export function ProductScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const pathname = usePathname();
  const status = useSessionStatus();
  const userId = getUserId();
  const { isConnected } = useConnectivity();
  const query = useProduct(id ?? '');

  const product = query.data;
  const offline = isConnected === false;

  useEffect(() => {
    if (id) void trackProductView(id);
  }, [id]);

  const like = useLikeProduct(userId);
  const liked = product ? isLikedBy(product.likes, userId) : false;

  const heart = product ? (
    <IconButton
      icon={liked ? 'heart' : 'heart-outline'}
      label={liked ? 'Saved' : 'Add to wishlist'}
      disabled={liked || like.isPending}
      onPress={() => {
        const action = resolveHeartAction(status);
        if (action === 'wait') return;
        if (action === 'login') {
          router.push(
            requireAuth(`/product/${product.id}` as Href, false, pathname),
          );
          return;
        }
        like.mutate(id ?? '');
      }}
    />
  ) : null;

  const content = (() => {
    if (query.isLoading) return <ProductSkeleton />;
    if (query.isError) {
      return <ErrorState onRetry={() => void query.refetch()} />;
    }
    if (product == null) {
      return (
        <EmptyState
          title="Product unavailable"
          hint="This product can't be found."
        />
      );
    }
    if (product.status !== 'approved') {
      return (
        <EmptyState
          title="Product unavailable"
          hint="This product is no longer available."
        />
      );
    }
    return (
      <PurchasableProduct
        product={product}
        userId={userId}
        offline={offline}
        onRetry={() => void query.refetch()}
      />
    );
  })();

  return (
    <View className="flex-1 bg-canvas">
      <DocumentTitle title={product?.name ?? 'Product'} />
      <ScreenHeader right={heart} />
      {content}
    </View>
  );
}
