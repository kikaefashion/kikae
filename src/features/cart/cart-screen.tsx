import { Link, Redirect, router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { CartLine } from '@/api/endpoints/cart';
import { useCart } from '@/api/queries/use-cart';
import { DocumentTitle } from '@/components/document-title';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { IconButton } from '@/components/ui/icon-button';
import { Image } from '@/components/ui/image';
import { InlineBanner } from '@/components/ui/inline-banner';
import { useConnectivity } from '@/components/ui/offline-state';
import { Price } from '@/components/ui/price';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { PAGE_TITLES } from '@/config/titles';
import { requireAuth } from '@/features/auth/require-auth';
import { QuantityStepper } from '@/features/product/product-action-area';
import { useSessionStatus, useUserId } from '@/session/session-store';
import { mediaUrl } from '@/utils/media-url';

import {
  cartSubtotal,
  lineExclusion,
  unitsAvailableForLine,
} from './selectors';
import { useCartMutations } from './use-cart-mutations';

function CartSkeleton() {
  return (
    <View className="gap-12 p-16">
      <Skeleton shape="row" />
      <Skeleton shape="row" />
      <Skeleton shape="row" />
    </View>
  );
}

function CartLineRow({
  line,
  cart,
  disabled,
  onUpdate,
  onRequestRemove,
}: {
  line: CartLine;
  cart: CartLine[];
  disabled: boolean;
  onUpdate: (units: number) => void;
  onRequestRemove: () => void;
}) {
  const exclusion = lineExclusion(line);

  if (exclusion) {
    return (
      <View className="flex-row items-start gap-12 rounded-lg border border-line bg-surface p-12">
        <Image
          source={mediaUrl(line.product.media[0]?.url)}
          alt={line.product.name}
          className="h-56 w-56 rounded-md"
        />
        <View className="flex-1 gap-4">
          <Text variant="subhead" color="fg" numberOfLines={2}>
            {line.product.name}
          </Text>
          {exclusion === 'free' ? (
            <View className="gap-4">
              <Text variant="callout" color="fg-muted">
                Free item:
              </Text>
              <Link href={`/product/${line.product.id}` as Href} asChild>
                <Pressable accessibilityRole="link" className="self-start">
                  <Text
                    variant="callout"
                    color="fg"
                    weight="medium"
                    className="underline"
                  >
                    claim it from its page
                  </Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            <Text variant="callout" color="fg-muted">
              Not available in this version
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-12 rounded-lg border border-line bg-surface p-12">
      <Image
        source={mediaUrl(line.product.media[0]?.url)}
        alt={line.product.name}
        className="h-56 w-56 rounded-md"
      />
      <View className="flex-1 gap-4">
        <Text variant="subhead" color="fg" numberOfLines={2}>
          {line.product.name}
        </Text>
        <Price amount={line.product.price} variant="callout" />
        <QuantityStepper
          quantity={line.units}
          max={unitsAvailableForLine(cart, line)}
          disabled={disabled}
          onChange={onUpdate}
        />
      </View>
      <IconButton
        icon="trash-outline"
        label={`Remove ${line.product.name}`}
        disabled={disabled}
        onPress={onRequestRemove}
      />
    </View>
  );
}

function CheckoutBar({
  subtotal,
  onCheckout,
}: {
  subtotal: number;
  onCheckout: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="border-t border-line bg-surface px-16 pt-8"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <View className="mb-8 flex-row items-center justify-between">
        <Text variant="callout" color="fg-muted">
          Estimated
        </Text>
        <Price amount={subtotal} emphasis variant="title-3" />
      </View>
      <Button variant="primary" size="lg" onPress={onCheckout}>
        Checkout
      </Button>
    </View>
  );
}

function CartContent() {
  const cart = useCart();
  const userId = useUserId();
  const { isConnected } = useConnectivity();
  const { update, remove } = useCartMutations();
  const [pendingRemoval, setPendingRemoval] = useState<CartLine | null>(null);

  const lines = cart.data?.lines ?? [];
  const failedCount = cart.data?.failedCount ?? 0;
  const offline = isConnected === false;
  const busy = update.isPending || remove.isPending;

  // The cart query waits for the resolved user id; show the skeleton until it
  // arrives rather than flashing an empty cart.
  if (userId === null || cart.isLoading) return <CartSkeleton />;

  if (cart.isError) {
    return <ErrorState onRetry={() => void cart.refetch()} />;
  }

  if (lines.length === 0 && failedCount === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        hint="Items you add to your cart will appear here."
        actionLabel="Browse Home"
        onActionPress={() => router.push('/' as Href)}
      />
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-canvas"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        {offline ? (
          <InlineBanner
            status="offline"
            label="You're offline — showing saved cart"
            actionLabel="Retry"
            onActionPress={() => void cart.refetch()}
          />
        ) : null}
        {failedCount > 0 ? (
          <InlineBanner
            status="error"
            label={`${failedCount} item${failedCount === 1 ? '' : 's'} couldn't be loaded`}
            actionLabel="Retry"
            onActionPress={() => void cart.refetch()}
          />
        ) : null}
        {lines.map((line) => (
          <CartLineRow
            key={line.id}
            line={line}
            cart={lines}
            disabled={busy}
            onUpdate={(units) => update.mutate({ line, units })}
            onRequestRemove={() => setPendingRemoval(line)}
          />
        ))}
      </ScrollView>
      {lines.length > 0 ? (
        <CheckoutBar
          subtotal={cartSubtotal(lines)}
          onCheckout={() => router.push('/checkout' as Href)}
        />
      ) : null}
      <Dialog
        visible={pendingRemoval !== null}
        onClose={() => setPendingRemoval(null)}
        label="Remove item"
        title="Remove item?"
        body={
          pendingRemoval
            ? `Remove ${pendingRemoval.product.name} from your cart?`
            : undefined
        }
        destructive
        actions={[
          {
            label: 'Cancel',
            onPress: () => setPendingRemoval(null),
          },
          {
            label: 'Remove',
            variant: 'danger',
            loading: remove.isPending,
            onPress: () => {
              if (pendingRemoval) remove.mutate(pendingRemoval);
              setPendingRemoval(null);
            },
          },
        ]}
      />
    </>
  );
}

export function CartScreen() {
  const status = useSessionStatus();

  if (status === 'loading') return <CartSkeleton />;

  if (status !== 'signedIn') {
    return <Redirect href={requireAuth('/cart' as Href, false, '/cart')} />;
  }

  return (
    <View className="flex-1 bg-canvas">
      <DocumentTitle title={PAGE_TITLES.cart} />
      <ScreenHeader title="Cart" />
      <CartContent />
    </View>
  );
}
