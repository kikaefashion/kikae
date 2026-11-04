import { ScreenLayout } from '@/components/navigation/screen-layout';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  return (
    <ScreenLayout>
      <Text variant="title-1" color="fg" accessibilityRole="header">
        Home
      </Text>
    </ScreenLayout>
  );
}
