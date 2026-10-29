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

## App configuration (environment-driven)

`app.config.ts` reads `process.env.APP_ENV` (`development` | `preview` | `production`, default `development`) and varies `name`, `ios.bundleIdentifier`, `android.package`, and `extra.apiBaseUrl` accordingly. `eas.json` sets `APP_ENV` per build profile.

| APP_ENV       | Bundle identifier                 | API base URL                            |
| ------------- | --------------------------------- | --------------------------------------- |
| `development` | `com.kikae.kikaeFrontend.dev`     | `https://frontend-dev.kikae.com.ng`     |
| `preview`     | `com.kikae.kikaeFrontend.preview` | `https://frontend-preview.kikae.com.ng` |
| `production`  | `com.kikae.kikaeFrontend`         | `https://www.kikae.com.ng`              |

## GitHub Actions workflows

### `ci.yml` — runs on pull requests and pushes to `main`

| Job           | What it does                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------- |
| `quality`     | `npm ci`, then typecheck, lint, and test (with coverage); uploads `coverage/` as an artifact |
| `expo-health` | `npx expo-doctor` and `npm audit --audit-level=high`                                         |
| `web-build`   | `npx expo export --platform web`; uploads `dist/` as an artifact                             |

### `preview.yml` — runs on pull requests

Publishes an EAS Update preview via `expo/expo-github-action/preview` (`eas update --auto`)
and comments the preview link + QR code on the PR. It skips gracefully when `EXPO_TOKEN`
is not set (the job still reports success).

### `release.yml` — runs on tags matching `v*.*.*`

Builds production binaries with `eas build --profile production --non-interactive --no-wait`.
The `submit` job (store submission) is present but **disabled** until store credentials are configured.

## Required GitHub Secrets (names only — no values)

| Secret       | Used by                      | Purpose                                                             |
| ------------ | ---------------------------- | ------------------------------------------------------------------- |
| `EXPO_TOKEN` | `preview.yml`, `release.yml` | EAS CLI access token (from https://expo.dev/settings/access-tokens) |

For the disabled store-submission step, later:

| Secret                                                                      | Purpose                                                    |
| --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `EAS_ASC_API_KEY_ID`                                                        | App Store Connect API key id                               |
| `EAS_ASC_API_KEY_ISSUER_ID`                                                 | App Store Connect API key issuer id                        |
| `EAS_ASC_API_KEY_PATH`                                                      | App Store Connect API key (`.p8`)                          |
| `EXPO_APPLE_ID` + `EXPO_APPLE_APP_SPECIFIC_PASSWORD` + `EXPO_APPLE_TEAM_ID` | Apple account auth (alternative to the ASC API key)        |
| Google Play service account key                                             | Managed via EAS (or a `GOOGLE_SERVICE_ACCOUNT_KEY` secret) |

## EAS one-time setup (manual)

1. Install and authenticate the CLI: `npx eas-cli login`.
2. Link the project: `npx eas-cli init` — then add the generated project id to `extra.eas.projectId` in `app.config.ts`.
3. Configure EAS Update: `npx eas-cli update:configure` — then add `updates.url` and `runtimeVersion` to `app.config.ts`.
4. Install the dev client for development builds: `npx expo install expo-dev-client`.
5. Create at least one preview/dev build so EAS Update has a binary to target.

## Branch protection (recommended)

On the default branch, require the following status checks to pass before merge:

- `quality` (Typecheck, lint & test)
- `expo-health` (Expo doctor & dependency audit)
- `web-build` (Web build)
- `update` (Publish EAS Update preview) — optional; it always reports success until `EXPO_TOKEN` is configured, after which it publishes a preview

> **Note:** the repository currently uses `master` as its default branch. Rename it to `main`
> (or change the `branches: [main]` filter in `.github/workflows/ci.yml`) so CI triggers on the default branch.
