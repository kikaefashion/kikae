import { http, HttpResponse } from 'msw';

import type { ExampleError, ExampleItem } from '@/examples/schema';

export const EXAMPLES_ENDPOINT = 'https://api.example.com/api/examples';

export const exampleItems: ExampleItem[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'First example',
    count: 1,
    done: false,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Second example',
    count: 2,
    done: true,
  },
];

const exampleError: ExampleError = { message: 'Not found' };

export const getExamplesSuccess = http.get(EXAMPLES_ENDPOINT, () =>
  HttpResponse.json<ExampleItem[]>(exampleItems),
);

export const getExamplesEmpty = http.get(EXAMPLES_ENDPOINT, () =>
  HttpResponse.json<ExampleItem[]>([]),
);

export const getExamplesError = http.get(EXAMPLES_ENDPOINT, () =>
  HttpResponse.json<ExampleError>(exampleError, { status: 404 }),
);

export const getExamplesNetworkError = http.get(EXAMPLES_ENDPOINT, () =>
  HttpResponse.error(),
);

export const handlers = [getExamplesSuccess];
