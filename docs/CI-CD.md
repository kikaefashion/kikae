# CI / CD

## Test coverage target

- Repo-wide target: **80%** coverage for lines, branches, functions, and statements across `src/**`.
- This target applies once the app rebuild is complete. Until then, `jest.config.js` scopes `collectCoverageFrom` to `src/examples/**` (the temporary example module).
- Every new feature folder must be added to `collectCoverageFrom` (with tests) in the same PR.

## Commands

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run typecheck`  | TypeScript type checking (`tsc --noEmit`) |
| `npm run lint`       | ESLint (`eslint . --max-warnings 0`)      |
| `npm run test`       | Jest (`jest --ci --coverage`)             |
| `npm run test:watch` | Jest watch mode                           |
| `npm run validate`   | Runs typecheck + lint + test              |
