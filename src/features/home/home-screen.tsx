import { router, usePathname, type Href } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, View, useWindowDimensions } from 'react-native';

import type { Category, Product } from '@/api/endpoints/home';
import { getUserId } from '@/api/identity';
import { useBanners } from '@/api/queries/use-banners';
import { useHome } from '@/api/queries/use-home';
import { Carousel, type CarouselSlide } from '@/components/ui/carousel';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { InlineBanner } from '@/components/ui/inline-banner';
import { useConnectivity } from '@/components/ui/offline-state';
import { ProductCard } from '@/components/ui/product-card';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { requireAuth, resolveHeartAction } from '@/features/auth/require-auth';
import { useSessionStatus } from '@/session/session-store';
import { useColumnCount } from '@/utils/layout';

import { toCarouselSlide } from './banner-links';
import { isLikedBy, toCardProduct } from './selectors';
import { useLikeProduct } from './use-like-product';

const RAIL_CARD_WIDTH = 160;

interface RailProps {
  title: string;
  products: Product[];
  userId: string | number | null;
  savingId: string | number | null;
  onHeartPress: (product: Product) => void;
}

function ProductRail({
  title,
  products,
  userId,
  savingId,
  onHeartPress,
}: RailProps) {
  if (products.length === 0) return null;

  return (
    <View className="gap-12">
      <SectionHeader title={title} />
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <ProductCard
            product={toCardProduct(item)}
            liked={isLikedBy(item.likes, userId)}
            saving={savingId === item.id}
            onLikePress={() => onHeartPress(item)}
            width={RAIL_CARD_WIDTH}
          />
        )}
      />
    </View>
  );
}

function HomeSkeleton({ columns }: { columns: number }) {
  const { width } = useWindowDimensions();
  const gap = width >= 1024 ? 24 : 16;
  const cardWidth = (width - 32 - gap * (columns - 1)) / columns;

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <Skeleton shape="banner" />
      <View className="flex-row gap-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} className="h-40 w-64 rounded-full bg-skeleton" />
        ))}
      </View>
      <Skeleton shape="section-header" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
        {Array.from({ length: columns * 2 }).map((_, index) => (
          <View key={index} style={{ width: cardWidth }}>
            <Skeleton shape="card" />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function HomeScreen() {
  const columns = useColumnCount();
  const pathname = usePathname();
  const status = useSessionStatus();
  const userId = getUserId();
  const connectivity = useConnectivity();
  const offline = connectivity.isConnected === false;

  const { data, isLoading, isError, refetch } = useHome();
  const banners = useBanners();
  const like = useLikeProduct(userId);
  const [refreshing, setRefreshing] = useState(false);

  if (isLoading && !data) {
    return <HomeSkeleton columns={columns} />;
  }

  if (isError && !data) {
    return (
      <View className="flex-1 bg-canvas">
        <ErrorState onRetry={() => void refetch()} />
      </View>
    );
  }

  if (!data) return null;

  const empty =
    data.new_arrivals.length === 0 &&
    data.featured_products.length === 0 &&
    data.thrift_products.length === 0 &&
    data.freebies.length === 0;

  if (empty) {
    return (
      <View className="flex-1 bg-canvas">
        <EmptyState
          title="Nothing here yet"
          hint="Check back soon for new drops."
          actionLabel="Retry"
          onActionPress={() => void refetch()}
        />
      </View>
    );
  }

  const chips = data.trending_categories.filter(
    (category) => category.product_count > 0,
  );
  const savingId = like.isPending ? like.variables : null;

  const onHeartPress = (product: Product) => {
    const action = resolveHeartAction(status);
    if (action === 'wait') return;
    if (action === 'login') {
      router.push(requireAuth('/' as Href, false, pathname));
      return;
    }
    like.mutate(product.id);
  };

  const openCategory = (category: Category) => {
    router.push(`/discover?categoryId=${category.id}` as Href);
  };

  const handleBannerPress = (slide: CarouselSlide) => {
    if (slide.href) router.push(slide.href as Href);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), banners.refetch()]);
    setRefreshing(false);
  };

  const bannerSlides = (banners.data ?? []).map(toCarouselSlide);

  return (
    <View className="flex-1 bg-canvas">
      <FlatList
        key={`home-${columns}`}
        data={data.new_arrivals}
        numColumns={columns}
        keyExtractor={(item) => String(item.id)}
        columnWrapperStyle={columns > 1 ? { gap: 16 } : undefined}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <ProductCard
            product={toCardProduct(item)}
            liked={isLikedBy(item.likes, userId)}
            saving={savingId === item.id}
            onLikePress={() => onHeartPress(item)}
          />
        )}
        ListHeaderComponent={
          <View className="gap-16">
            <Carousel slides={bannerSlides} onSlidePress={handleBannerPress} />
            <Text variant="title-1" color="fg" accessibilityRole="header">
              Home
            </Text>
            {offline ? (
              <InlineBanner
                status="offline"
                label="You're offline — showing saved items"
                actionLabel="Retry"
                onActionPress={() => void refetch()}
              />
            ) : null}
            {!offline && isError ? (
              <InlineBanner
                status="error"
                label="Couldn't refresh. Showing saved items."
                actionLabel="Retry"
                onActionPress={() => void refetch()}
              />
            ) : null}
            {chips.length > 0 ? (
              <FlatList
                horizontal
                data={chips}
                keyExtractor={(item) => String(item.id)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                renderItem={({ item }) => (
                  <Chip
                    role="category"
                    label={item.name}
                    onPress={() => openCategory(item)}
                  />
                )}
              />
            ) : null}
            {data.new_arrivals.length > 0 ? (
              <SectionHeader
                title="New in"
                actionLabel="See all"
                onActionPress={() => router.push('/discover' as Href)}
              />
            ) : null}
          </View>
        }
        ListFooterComponent={
          <View className="gap-24">
            <ProductRail
              title="Featured"
              products={data.featured_products}
              userId={userId}
              savingId={savingId}
              onHeartPress={onHeartPress}
            />
            <ProductRail
              title="Thrift"
              products={data.thrift_products}
              userId={userId}
              savingId={savingId}
              onHeartPress={onHeartPress}
            />
            <ProductRail
              title="Free"
              products={data.freebies}
              userId={userId}
              savingId={savingId}
              onHeartPress={onHeartPress}
            />
          </View>
        }
      />
    </View>
  );
}
