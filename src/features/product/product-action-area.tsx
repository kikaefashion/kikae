import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { ProductDetail } from '@/api/endpoints/product';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';

export interface SizeColourPickerProps {
  sizes: { id: string | number; size: string }[];
  colours: { id: string | number; name: string }[];
  sizeId: string | number | null;
  colorId: string | number | null;
  onSizeChange: (id: string | number) => void;
  onColorChange: (id: string | number) => void;
  /** Inline validation, shown only after an attempted action with a missing pick. */
  showSizeError: boolean;
  showColorError: boolean;
}

/** Single-select size/colour chips; required when the product has options. */
export function SizeColourPicker({
  sizes,
  colours,
  sizeId,
  colorId,
  onSizeChange,
  onColorChange,
  showSizeError,
  showColorError,
}: SizeColourPickerProps) {
  return (
    <View className="gap-16">
      {sizes.length > 0 ? (
        <View className="gap-8">
          <Text variant="caption" color="fg-muted">
            Size
          </Text>
          <View className="flex-row flex-wrap gap-8">
            {sizes.map((size) => (
              <Chip
                key={String(size.id)}
                role="filter"
                label={size.size}
                selected={sizeId === size.id}
                onPress={() => onSizeChange(size.id)}
              />
            ))}
          </View>
          {showSizeError ? (
            <Text variant="caption" color="error">
              Select a size
            </Text>
          ) : null}
        </View>
      ) : null}

      {colours.length > 0 ? (
        <View className="gap-8">
          <Text variant="caption" color="fg-muted">
            Colour
          </Text>
          <View className="flex-row flex-wrap gap-8">
            {colours.map((colour) => (
              <Chip
                key={String(colour.id)}
                role="filter"
                label={colour.name}
                selected={colorId === colour.id}
                onPress={() => onColorChange(colour.id)}
              />
            ))}
          </View>
          {showColorError ? (
            <Text variant="caption" color="error">
              Select a colour
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function QuantityStepper({
  quantity,
  max,
  disabled,
  onChange,
}: {
  quantity: number;
  max: number;
  disabled: boolean;
  onChange: (next: number) => void;
}) {
  return (
    <View className="flex-row items-center gap-8">
      <IconButton
        icon="remove"
        label="Decrease quantity"
        disabled={disabled || quantity <= 1}
        onPress={() => onChange(quantity - 1)}
      />
      <Text variant="body" color={disabled ? 'fg-disabled' : 'fg'}>
        {quantity}
      </Text>
      <IconButton
        icon="add"
        label="Increase quantity"
        disabled={disabled || quantity >= max}
        onPress={() => onChange(quantity + 1)}
      />
    </View>
  );
}

export interface ProductActionAreaProps {
  product: ProductDetail;
  quantity: number;
  /** Purchasable units left once existing cart lines are counted. */
  remaining: number;
  pending: boolean;
  onQuantityChange: (next: number) => void;
  onAddToCart: () => void;
  onGetForFree: () => void;
}

/**
 * Bottom action bar. Makeup products render nothing (the read-only note lives in
 * the content); freebies render "Get for free"; everything else renders a
 * quantity stepper + Add to cart, disabled when sold out or not approved.
 */
export function ProductActionArea({
  product,
  quantity,
  remaining,
  pending,
  onQuantityChange,
  onAddToCart,
  onGetForFree,
}: ProductActionAreaProps) {
  const insets = useSafeAreaInsets();
  const free = product.price === 0;
  const disabled = product.status !== 'approved' || remaining <= 0;

  if (product.isMakeup) return null;

  return (
    <View
      className="border-t border-line bg-surface px-16 pt-8"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      {free ? (
        <Button variant="primary" size="lg" onPress={onGetForFree} disabled={disabled}>
          Get for free
        </Button>
      ) : (
        <View className="flex-row items-center gap-16">
          <QuantityStepper
            quantity={quantity}
            max={Math.max(1, remaining)}
            disabled={disabled}
            onChange={onQuantityChange}
          />
          <Button
            variant="primary"
            size="lg"
            loading={pending}
            disabled={disabled}
            onPress={onAddToCart}
            className="flex-1"
          >
            Add to cart
          </Button>
        </View>
      )}
    </View>
  );
}