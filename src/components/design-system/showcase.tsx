import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { colorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel } from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { IconButton } from '@/components/ui/icon-button';
import { Image } from '@/components/ui/image';
import { InlineBanner } from '@/components/ui/inline-banner';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { OfflineState } from '@/components/ui/offline-state';
import { Price } from '@/components/ui/price';
import { ProductCard, type ProductCardProduct } from '@/components/ui/product-card';
import { Radio } from '@/components/ui/radio';
import { SectionHeader } from '@/components/ui/section-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Text, type TextVariant } from '@/components/ui/text';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { roles, type as typeScale } from '@/theme/tokens';

type Mode = 'system' | 'light' | 'dark';

const textVariants: TextVariant[] = [
  'display',
  'title-1',
  'title-2',
  'title-3',
  'headline',
  'body',
  'callout',
  'subhead',
  'footnote',
  'caption',
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="gap-12">
      <Text variant="title-3" color="fg">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row flex-wrap items-center gap-8">{children}</View>
  );
}

const showcaseProduct: ProductCardProduct = {
  id: 1,
  name: 'Ankara dress',
  storeName: 'Ada Threads',
  price: 12000,
  oldPrice: 15000,
  units: 5,
  thrift: true,
  ratings: [{ rating: 4 }, { rating: 5 }],
  imageUrl: null,
};

function ToastDemo() {
  const toast = useToast();
  return (
    <Row>
      <Button
        size="sm"
        variant="secondary"
        onPress={() => toast.success('Saved')}
      >
        Success
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onPress={() => toast.error('Copy failed')}
      >
        Error
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onPress={() => toast.info('Heads up')}
      >
        Info
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onPress={() => toast.warning('Low stock')}
      >
        Warning
      </Button>
    </Row>
  );
}

export default function DesignSystemContent() {
  const [mode, setMode] = useState<Mode>('system');
  const changeMode = (next: Mode) => {
    setMode(next);
    colorScheme.set(next);
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ToastProvider>
        <ScrollView contentContainerStyle={{ padding: 24, gap: 32 }}>
        <View className="gap-8">
          <Text variant="title-1" color="fg">
            Design system
          </Text>
          <Text variant="callout" color="fg-muted">
            Dev-only preview of every primitive. Icons follow the system scheme;
            surfaces and text follow the toggle below.
          </Text>
        </View>

        <Row>
          {(['system', 'light', 'dark'] as const).map((option) => (
            <Button
              key={option}
              variant={mode === option ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => changeMode(option)}
            >
              {option}
            </Button>
          ))}
        </Row>

        <Section title="Color tokens">
          <View className="flex-row flex-wrap gap-8">
            {Object.entries(roles.light).map(([name, hex]) => (
              <View key={name} className="w-1/2 flex-row items-center gap-8">
                <View
                  className="h-32 w-32 rounded-xs border border-line"
                  style={{ backgroundColor: hex }}
                />
                <View className="flex-1">
                  <Text variant="footnote" color="fg">
                    {name}
                  </Text>
                  <Text variant="caption" color="fg-muted">
                    {hex}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Type scale">
          <View className="gap-8">
            {textVariants.map((variant) => (
              <Text key={variant} variant={variant} color="fg">
                {variant} · {typeScale[variant].size}px
              </Text>
            ))}
          </View>
        </Section>

        <Section title="Button">
          <Row>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="text">Text</Button>
            <Button variant="danger" icon="trash">
              Delete
            </Button>
          </Row>
          <Row>
            <Button size="sm" icon="cart">
              Small
            </Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </Row>
          <Button size="lg" icon="cart">
            Add to cart
          </Button>
        </Section>

        <Section title="IconButton">
          <Row>
            <IconButton icon="heart-outline" label="Add to wishlist" />
            <IconButton icon="cart" label="Cart" />
            <IconButton icon="close" label="Close" disabled />
          </Row>
        </Section>

        <Section title="Input">
          <View className="gap-16">
            <Input
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input label="Password" error="Must be at least 8 characters" />
            <Input label="Disabled" editable={false} value="Locked" />
            <Input label="Boxed" boxed placeholder="Search" />
          </View>
        </Section>

        <Section title="Selection controls">
          <Row>
            <Checkbox checked label="Agree" onValueChange={() => {}} />
            <Checkbox
              checked={false}
              disabled
              label="Disabled"
              onValueChange={() => {}}
            />
          </Row>
          <Row>
            <Radio checked label="Standard" onValueChange={() => {}} />
            <Radio checked={false} label="Express" onValueChange={() => {}} />
          </Row>
          <Row>
            <Switch checked label="Notifications" onValueChange={() => {}} />
            <Switch checked={false} label="Off" onValueChange={() => {}} />
          </Row>
        </Section>

        <Section title="Chip">
          <Row>
            <Chip role="filter" label="In stock" selected />
            <Chip role="filter" label="On sale" />
            <Chip role="category" label="Fashion" />
            <Chip role="tab" label="Products" selected />
            <Chip role="tab" label="Makeup" />
          </Row>
        </Section>

        <Section title="Badge">
          <Row>
            <Badge count={5} />
            <Badge count={120} />
            <Badge status="success" icon="checkmark-circle" label="In stock" />
            <Badge status="error" icon="alert-circle" label="Out of stock" />
          </Row>
        </Section>

        <Section title="Avatar">
          <Row>
            <Avatar size={24} name="Ada Lovelace" />
            <Avatar size={32} name="Kikae" />
            <Avatar size={40} name="Ada Lovelace" />
            <Avatar size={56} name="Ada Lovelace" />
            <Avatar size={96} />
          </Row>
        </Section>

        <Section title="Skeleton">
          <View className="gap-16">
            <Skeleton shape="row" />
            <Skeleton shape="card" />
            <Skeleton shape="text" lines={2} />
            <Skeleton shape="banner" />
          </View>
        </Section>

        <Section title="Price">
          <Row>
            <Price amount={12500} />
            <Price amount={12500} emphasis variant="title-2" />
          </Row>
        </Section>

        <Section title="Loading">
          <Row>
            <Loading />
            <Loading size="lg" label="Loading more" />
          </Row>
        </Section>

        <Section title="InlineBanner">
          <View className="gap-12">
            <InlineBanner
              status="offline"
              label="You're offline — check your connection"
              actionLabel="Retry"
              onActionPress={() => {}}
            />
            <InlineBanner status="pending" label="Store awaiting approval" />
            <InlineBanner
              status="error"
              label="Payment failed"
              actionLabel="Retry"
              onActionPress={() => {}}
            />
          </View>
        </Section>

        <Section title="EmptyState">
          <EmptyState
            title="Nothing here yet"
            hint="Items you save will appear here."
          />
          <EmptyState
            variant="no-results"
            title="No results for shoes"
            hint="Try a different search or clear your filters."
            actionLabel="Clear filters"
            onActionPress={() => {}}
          />
        </Section>

        <Section title="Error / Offline">
          <ErrorState onRetry={() => {}} lastUpdated="just now" />
          <OfflineState
            onRetry={() => {}}
            lastUpdated="2m ago"
            isConnected={false}
          />
        </Section>

        <Section title="Toast">
          <ToastDemo />
        </Section>

        <Section title="SectionHeader">
          <View className="gap-12">
            <SectionHeader title="New in" />
            <SectionHeader
              title="Featured"
              actionLabel="See all"
              onActionPress={() => {}}
            />
          </View>
        </Section>

        <Section title="Image">
          <Row>
            <Image
              source="https://media.test/profile-pic/x.webp"
              alt="Sample product"
              className="h-96 w-80 rounded-lg"
            />
            <Image source={null} alt="Missing" className="h-96 w-80 rounded-lg" />
          </Row>
        </Section>

        <Section title="Carousel">
          <Carousel
            slides={[
              {
                id: 1,
                title: 'Makeup',
                text: 'View Makeup services',
                imageUrl: 'https://media.test/profile-pic/x.webp',
                href: '/makeup',
              },
              {
                id: 3,
                title: 'Stores',
                text: 'View Various Stores',
                imageUrl: 'https://media.test/profile-pic/y.webp',
                href: '/stores',
              },
              {
                id: 4,
                title: 'Freebies',
                text: 'View Freebies',
                imageUrl: null,
                href: '/freebies',
              },
            ]}
            onSlidePress={() => {}}
          />
        </Section>

        <Section title="ProductCard">
          <Row>
            <ProductCard product={showcaseProduct} width={160} />
            <ProductCard
              product={{ ...showcaseProduct, id: 2, price: 0, oldPrice: null, units: 0, ratings: [] }}
              liked
              width={160}
            />
          </Row>
        </Section>
        </ScrollView>
      </ToastProvider>
    </SafeAreaView>
  );
}
