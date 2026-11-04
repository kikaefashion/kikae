import { defineConfig, devices } from '@playwright/test';

const PORT = 8091;

/**
 * Playwright runs against the production server build (`expo export --platform
 * web` → `dist`). `npx expo serve` hosts that server-rendered output; the
 * `webServer` block starts it for us. Chromium only, per the project's e2e
 * scope.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npx expo serve dist --port ${PORT}`,
    url: `http://localhost:${PORT}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // Hermetic URLs, required by the server-rendered build (src/config/env.ts
      // fail-fast check). Must match e2e/support/backend.ts and
      // scripts/test-e2e.js. Overrides any local .env.* values.
      EXPO_PUBLIC_AUTH_URL: 'https://auth.e2e.test',
      EXPO_PUBLIC_API_URL: 'https://api.e2e.test',
      EXPO_PUBLIC_MEDIA_URL_PREFIX: 'https://media.e2e.test/',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
