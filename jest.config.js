/**
 * Jest configuration for the kikae Expo app.
 *
 * TODO(coverage): `collectCoverageFrom` is intentionally scoped to the temporary
 * `src/examples/**` module while the app is being rebuilt. Add every new feature
 * folder to this list in the same PR (with tests). Once the rebuild is complete,
 * widen this to `src/**` in one line and keep the 80% thresholds.
 * See docs/CI-CD.md for the repo-wide target.
 */
module.exports = {
  preset: 'jest-expo',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

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
    'src/examples/**/*.{ts,tsx}',
    '!src/examples/**/__tests__/**',
    '!**/*.test.{ts,tsx}',
    '!**/*.d.ts',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
