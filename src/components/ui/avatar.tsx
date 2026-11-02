import { Image } from 'expo-image';
import { View } from 'react-native';
import { clsx } from 'tailwind-variants';

import { Icon, type IconSize } from '@/components/ui/icon';
import { Text, type TextVariant } from '@/components/ui/text';

export type AvatarSize = 24 | 32 | 40 | 56 | 96;

const sizeClasses: Record<AvatarSize, string> = {
  24: 'h-24 w-24',
  32: 'h-32 w-32',
  40: 'h-40 w-40',
  56: 'h-56 w-56',
  96: 'h-96 w-96',
};

const initialsVariant: Record<AvatarSize, TextVariant> = {
  24: 'caption',
  32: 'footnote',
  40: 'subhead',
  56: 'headline',
  96: 'title-2',
};

function initialsFor(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export interface AvatarProps {
  /** Size from tokens.md §14 (24/32/40/56/96); default 40. */
  size?: AvatarSize;
  /** Name used to derive initials when no image is provided. */
  name?: string;
  imageUrl?: string;
  accessibilityLabel?: string;
}

/**
 * Circular avatar: image, initials, or a neutral placeholder (components.md §2).
 */
export function Avatar({
  size = 40,
  name,
  imageUrl,
  accessibilityLabel,
}: AvatarProps) {
  const label = accessibilityLabel ?? name ?? 'Avatar';
  const initials = initialsFor(name);
  const placeholderSize: IconSize = size === 24 ? 16 : size === 96 ? 32 : 24;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      className={clsx(
        'items-center justify-center overflow-hidden rounded-full border border-line bg-surface',
        sizeClasses[size],
      )}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: size }}
          contentFit="cover"
        />
      ) : initials ? (
        <Text
          variant={initialsVariant[size]}
          color="fg-muted"
          maxFontSizeMultiplier={1.3}
        >
          {initials}
        </Text>
      ) : (
        <Icon
          name="person"
          size={placeholderSize}
          color="icon-muted"
          aria-hidden
        />
      )}
    </View>
  );
}
