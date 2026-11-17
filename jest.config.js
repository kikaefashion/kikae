/**
 * Jest configuration for the kikae Expo app.
 *
 * Coverage policy (risk-based): logic folders (api, session, utils) keep strict
 * thresholds; everything else has a lower floor. Add every new source folder to
 * `collectCoverageFrom` in the same PR.
 * Day to day: `yarn test:fast <path>` (no coverage). CI runs `yarn test`.
 */
module.exports = {
  preset: 'jest-expo',

  // RNTL first renders under `--coverage` + parallel workers can exceed the
  // 5s default on this machine; give them headroom.
  testTimeout: 15000,

  // React Native's VirtualizedList and the session store's useSyncExternalStore
  // leave timers/handles open in the no-layout Jest renderer, keeping workers
  // alive after the suite finishes. Force the process to exit once tests pass.
  forceExit: true,

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Playwright owns the e2e/ directory; Jest must not try to run its specs.
  testPathIgnorePatterns: ['<rootDir>/e2e/'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // MSW ships ESM-only transitive dependencies (e.g. `rettime`) that Jest cannot
  // `require` natively. Let babel-jest transform them to CommonJS.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|@open-draft|@inquirer|rettime|until-async))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
  transform: {
    '\\.mjs$': ['babel-jest', { presets: ['babel-preset-expo'] }],
  },

  collectCoverageFrom: [
    'src/theme/**/*.{ts,tsx}',
    'src/config/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    'src/api/**/*.{ts,tsx}',
    'src/session/**/*.{ts,tsx}',
    'src/providers/**/*.{ts,tsx}',
    'src/features/**/*.{ts,tsx}',
    'src/components/ui/**/*.{ts,tsx}',
    'src/components/navigation/**/*.{ts,tsx}',
    '!src/**/__tests__/**',
    '!**/*.test.{ts,tsx}',
    '!**/*.d.ts',
  ],

  // Short terminal output (a full per-file table costs tokens and time).
  coverageReporters: ['text-summary', 'lcov'],

  // Per-path entries are evaluated separately; `global` then covers the rest.
  coverageThreshold: {
    global: { branches: 60, functions: 65, lines: 70, statements: 70 },
    './src/api/': { branches: 80, functions: 85, lines: 85, statements: 85 },
    './src/session/': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './src/utils/': { branches: 80, functions: 85, lines: 85, statements: 85 },
  },
};
