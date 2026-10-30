# Security advisories

CI runs a dependency audit via `node scripts/check-audit.js` (a wrapper around
`yarn audit --level high`) and fails only on **high/critical** advisories that are
not recorded in `audit-allowlist.json`. The advisories below are accepted for now:
they are transitive to build/dev tooling (the Expo CLI and Jest), are not shipped in
or reachable from the running app, and have no upstream fix available yet.

## Accepted advisories

### zod — high (advisory `1243066`, GHSA-mrhx-c7xc-m3w5)

- **Title:** Zod can exhaust memory while validating oversized constrained collections
- **Path:** `expo > @expo/cli > zod@3.25.76`
- **Why accepted:**
  - The app's own `zod` dependency is already the patched `4.6.7` (advisory fixed in `>=4.6.6`).
  - The vulnerable copy is `@expo/cli`'s transitive `zod@3.25.76`. There is no zod 3.x backport,
    and the latest `@expo/cli@58.1.17` still pins `zod@^3.25.76`.
  - The memory-exhaustion DoS only affects the local Expo CLI (build/dev tooling), not the app.
- **Re-check:** on the next Expo SDK release, or if zod backports the fix to the v3 line.

### deepmerge — low (advisory `1243505`, GHSA-gcqx-w48m-w2h4)

- **Title:** deepmerge mergeObject() allows prototype poisoning of returned objects
- **Paths:** `expo > @expo/config > deepmerge`, `jest > … > jest-config > deepmerge`
- **Why accepted:** upstream reports "No patch available"; low severity; build/test tooling only.
