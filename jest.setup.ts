// Test environment — provide EXPO_PUBLIC_* values so `src/config/env.ts`
// (and anything that imports it) can load during Jest without throwing.
import { server } from '@/test-utils/msw/server';

process.env.EXPO_PUBLIC_AUTH_URL = 'https://auth.test';
process.env.EXPO_PUBLIC_API_URL = 'https://api.test';
process.env.EXPO_PUBLIC_MEDIA_URL_PREFIX = 'https://media.test/';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
