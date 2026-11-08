import { useLocalSearchParams } from 'expo-router';

import { ComingSoonScreen } from '@/components/navigation/screen-layout';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <ComingSoonScreen title={id ? `Product ${id}` : 'Product'} />;
}