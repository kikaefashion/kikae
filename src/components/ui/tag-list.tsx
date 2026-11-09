import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export interface TagListProps {
  /** Section label, e.g. "Available in sizes". */
  label: string;
  values: string[];
}

/** Read-only pill list (surface + border) for sizes/colours — no selection. */
export function TagList({ label, values }: TagListProps) {
  if (values.length === 0) return null;

  return (
    <View className="gap-8">
      <Text variant="caption" color="fg-muted">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-8">
        {values.map((value) => (
          <View
            key={value}
            className="rounded-full border border-line bg-surface px-12 py-4"
          >
            <Text variant="callout" color="fg">
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
