import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { useExamples } from './use-examples';

export function ExamplesList() {
  const { data, isPending, isError, refetch } = useExamples();

  if (isPending) {
    return (
      <View>
        <ActivityIndicator accessibilityLabel="Loading examples" />
        <Text>Loading examples…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text accessibilityRole="alert">Failed to load examples.</Text>
        <Text onPress={() => void refetch()}>Try again</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View>
        <Text>No examples yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
}
