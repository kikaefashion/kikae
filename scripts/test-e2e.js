/**
 * Builds the web export with hermetic dummy EXPO_PUBLIC_* URLs, then runs the
 * Playwright suite. Run via `yarn test:e2e` (so `node_modules/.bin` is on PATH).
 */
const { execSync } = require('node:child_process');

const env = {
  ...process.env,
  // Inlined at build time; these must match e2e/support/backend.ts.
  EXPO_PUBLIC_AUTH_URL: 'https://auth.e2e.test',
  EXPO_PUBLIC_API_URL: 'https://api.e2e.test',
  EXPO_PUBLIC_MEDIA_URL_PREFIX: 'https://media.e2e.test/',
};

function run(command) {
  try {
    execSync(command, { stdio: 'inherit', env });
  } catch (error) {
    const status = typeof error.status === 'number' ? error.status : 1;
    process.exit(status);
  }
}

run('expo export --platform web');
run('playwright test');
