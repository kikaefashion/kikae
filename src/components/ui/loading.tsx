import { ActivityIndicator, View } from 'react-native';
import { clsx } from 'tailwind-variants';

import { useTextColor } from '@/components/ui/colors';

export type LoadingSize = 'sm' | 'lg';

const indicatorSize: Record<LoadingSize, 'small' | 'large'> = {
  sm: 'small',
  lg: 'large',
};

export interface LoadingProps {
  /** Accessible label announced for the progress indicator (default "Loading"). */
  label?: string;
  /** In-place spinner size; `sm` (small) or `lg` (large). Default `sm`. */
  size?: LoadingSize;
  className?: string;
}

/**
 * Small in-place spinner (components.md §4). Skeleton covers first paints;
 * this is only for in-place actions (button, footer pagination). Announces
 * itself as a progress indicator; it renders without motion so the
 * reduced-motion setting needs no extra handling.
 */
export function Loading({
  label = 'Loading',
  size = 'sm',
  className,
}: LoadingProps) {
  const color = useTextColor('icon');
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      className={clsx('items-center justify-center', className)}
    >
      <ActivityIndicator size={indicatorSize[size]} color={color} />
    </View>
  );
}
