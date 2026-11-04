import { Pressable, View } from 'react-native';
import { clsx } from 'tailwind-variants';

import { focusRing, TOUCH_TARGET } from '@/components/ui/constants';
import { Text } from '@/components/ui/text';

export interface SectionHeaderProps {
  title: string;
  /** Optional trailing action (e.g. "See all"). */
  actionLabel?: string;
  onActionPress?: () => void;
}

/**
 * Row with a section title and an optional trailing action. The title is a
 * heading; the action is a ≥44px pressable link.
 */
export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between gap-12">
      <Text variant="title-3" color="fg" accessibilityRole="header">
        {title}
      </Text>
      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onActionPress}
          className={clsx('items-center justify-center px-8', focusRing)}
          style={({ pressed }) => [
            { minHeight: TOUCH_TARGET },
            pressed ? { opacity: 0.7 } : null,
          ]}
        >
          <Text
            variant="callout"
            color="fg"
            weight="medium"
            maxFontSizeMultiplier={1.3}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
