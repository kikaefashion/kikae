import { Text, type TextVariant } from '@/components/ui/text';
import { formatNaira } from '@/utils/format-naira';

export interface PriceProps {
  amount: number;
  /** Bold for emphasis (default false). */
  emphasis?: boolean;
  variant?: TextVariant;
}

/** `formatNaira` in `fg`, bold for emphasis (components.md §2). */
export function Price({
  amount,
  emphasis = false,
  variant = 'body',
}: PriceProps) {
  return (
    <Text variant={variant} color="fg" weight={emphasis ? 'bold' : undefined}>
      {formatNaira(amount)}
    </Text>
  );
}
