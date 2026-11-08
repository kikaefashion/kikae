import { Text, type TextVariant } from '@/components/ui/text';
import { formatNaira } from '@/utils/format-naira';

export interface PriceProps {
  amount: number;
  /** Bold for emphasis (default false). */
  emphasis?: boolean;
  variant?: TextVariant;
  /** Truncate to one line when the price outgrows its row. */
  numberOfLines?: number;
}

/** `formatNaira` in `fg`, bold for emphasis (components.md §2). */
export function Price({
  amount,
  emphasis = false,
  variant = 'body',
  numberOfLines,
}: PriceProps) {
  return (
    <Text
      variant={variant}
      color="fg"
      weight={emphasis ? 'bold' : undefined}
      numberOfLines={numberOfLines}
      className="shrink"
    >
      {formatNaira(amount)}
    </Text>
  );
}
