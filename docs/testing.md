# Testing

## Web end-to-end (Playwright)

The login flow has a hermetic Playwright suite (`e2e/login.spec.ts`). It builds a
static web export with dummy `EXPO_PUBLIC_*` URLs, serves it with
`npx expo serve`, and mocks every backend call with typed JSON fixtures — no real
backend is contacted.

```bash
# one-time browser install (Chromium only)
npx playwright install chromium

# build + run the suite (also what CI runs)
yarn test:e2e
```

The HTML report is written to `playwright-report/` (open it with
`npx playwright show-report`). Traces and screenshots are written to
`test-results/` on retries/failures only; both directories are gitignored.

## Mobile end-to-end (Maestro)

Maestro flows live in `.maestro/` and use visible text and accessibility labels
only. Credentials are never committed — they are injected from the shell.

```bash
# requires a development build of the app installed (appId com.kikae.kikaeFrontend.dev)
MAESTRO_EMAIL=you@example.com \
MAESTRO_PASSWORD='your real password' \
maestro test .maestro/login-success.yaml

MAESTRO_EMAIL=you@example.com \
MAESTRO_WRONG_PASSWORD='any value that is not the real password' \
maestro test .maestro/login-wrong-password.yaml
```

There is no CI job for Maestro yet.
