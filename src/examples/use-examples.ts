import { useQuery } from '@tanstack/react-query';

import { ExampleItemListSchema, type ExampleItemList } from './schema';

const EXAMPLES_URL = 'https://api.example.com/api/examples';
const EXAMPLES_QUERY_KEY = ['examples'] as const;

async function fetchExamples(): Promise<ExampleItemList> {
  const response = await fetch(EXAMPLES_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch examples: ${response.status}`);
  }

  const json: unknown = await response.json();
  return ExampleItemListSchema.parse(json);
}

export function useExamples() {
  return useQuery({
    queryKey: EXAMPLES_QUERY_KEY,
    queryFn: fetchExamples,
  });
}
