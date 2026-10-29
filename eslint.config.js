// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'coverage/', '.expo/', 'node_modules/'],
  },
  {
    // eslint-config-expo registers the @typescript-eslint plugin only for
    // TypeScript files, so scope this rule to .ts/.tsx to avoid a
    // "plugin not found" error on .js files.
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]);
