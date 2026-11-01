// Test environment — provide EXPO_PUBLIC_* values so `src/config/env.ts`
// (and anything that imports it) can load during Jest without throwing.
import { AccessibilityInfo } from 'react-native';

import { server } from '@/test-utils/msw/server';

process.env.EXPO_PUBLIC_AUTH_URL = 'https://auth.test';
process.env.EXPO_PUBLIC_API_URL = 'https://api.test';
process.env.EXPO_PUBLIC_MEDIA_URL_PREFIX = 'https://media.test/';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Respect reduced motion in tests so the Skeleton pulse animation never
// schedules a looping timer that keeps the Jest worker alive.
jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

// Icon glyphs don't need the real font in Jest — use the manual mock in
// `__mocks__/@expo/vector-icons.tsx` (renders the icon name as text).
jest.mock('@expo/vector-icons');

// `expo-image` loads images asynchronously; use the manual mock in
// `__mocks__/expo-image.ts` (a plain View) so no fetch stays open.
jest.mock('expo-image');
