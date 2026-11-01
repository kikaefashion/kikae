# Kikae — Build Order

Recommended build sequence, grouped by shared components, with dependencies and per-phase
milestones. Every phase must be demoable at its end. Backend-scan results are inlined per phase
("Backend scan:" lines, filled from `docs/backend-findings.md`).

## Definition of done (every phase)

- Spec implemented; all states tested (loading / error / empty / offline / populated);
  responsive at **375 / 768 / 1024 / 1440**; accessibility checks pass; `collectCoverageFrom`
  widened in `jest.config.js`; CI green.

## Phase 0a — Foundations: config, tokens, API, auth storage

- `tokens.md` → Tailwind/NativeWind config + CSS variables; `layout-system.md` grid + `useColumnCount`.
- Typed API client (fetch + `zod`) with `Authorization: Bearer`; one toast module; `formatNaira`.
- Auth token storage: SecureStore (native) — web mechanism pending backend scan.
- **Cleanup:** delete `src/examples/`; widen `collectCoverageFrom` to new feature folders.
- Backend scan: Sanctum bearer token, no expiry — store in SecureStore (native) + `localStorage`/cookie (web). No cookie/session auth required.

## Phase 0b — Foundations: components + design-system showcase

- Core components: Button, IconButton, Input, PhoneInput, OtpInput, Select, Checkbox, Switch, Chip,
  Sheet, Dialog, Toast, EmptyState, ErrorState/OfflineState, InlineBanner, Skeleton, Image,
  ProductCard, Price, SectionHeader, ListItem, SearchBar, Carousel, AddressForm (built early — checkout
  depends on it).
- A **design-system showcase screen** (dev-only) rendering every component + state.
- Backend scan: **no LGA** anywhere. Delivery fee depends on `area_id` from `logistic_destinations`; AddressForm uses an **area picker** fed by `/uniqueLogisticState` → `/uniqueLogisticStateArea` → `/stateAreaLogistic`.

## Phase 1 — Auth (F1a, F1b)

- Login, Register, Verify email, Reset password, Onboarding, Google sign-in.
- **Quality milestones:** Playwright (web) + Maestro (native) E2E for login/register/reset; Sentry
  error tracking on; first **EAS preview build**.
- Backend scan: `/social-login/google` returns `{token, user}` (confirmed); OTP = 6 digits; no login lockout/429 (drop the too-many-attempts banner).

## Phase 2 — Home feed + basic product detail (F2 + F4-min)

- Home feed **plus a basic product detail** (single image + price + add-to-cart) so the app is
  demoable end-to-end. Full product detail is Phase 4.
- Backend scan: `GET /customer/v2/home` is public and serves the sections.

## Phase 3 — Discover, categories & search (F3a, F3b)

- Backend scan: `/searchProducts` returns a single product list (not `{products, stores}`); categories path = `/v2/categories` (the old `/api/v2/categories` double-`/api` is a client bug).

## Phase 4 — Product detail & engagement (F4, full)

- Gallery, variations, reviews, comments, like, report, share. The **"Custom size" entry stays
  hidden behind a feature flag until Phase 9**.
- Backend scan: unlike is **not supported** (no `like:false`/DELETE) — flag `canUnlike` off; `/getReviews` **is** the canonical review list.

## Phase 5 — Stores directory & storefront (F7)

- Backend scan: `/getStoreLikes` accepts the viewed `store_id` (confirmed); `/store/get/{id}` returns no `is_following`/like/follow counts — compute client-side or flag off.

## Phase 6 — Cart, checkout & payment (F8)

- **OrderStatusStepper (single enum map) is built here** — orders first appear at checkout; shared
  with Profile (Phase 7) and Custom orders (Phase 9).
- **Quality milestone:** payment E2E against the Paystack **sandbox**; crash/disconnect recovery test.
- Backend scan: amounts are re-checked server-side in `/payments/initiate` + `/payments/verify`;
  **`/storeTransaction` is commented out — drop it** (order creation happens inside `/payments/verify`,
  which is idempotent). Web recovery = re-call `/payments/verify/{reference}`.

## Phase 7 — Profile & account (F9)

- Backend scan: `/currentUser` includes `addresses`, `followings`, `usertype` and `user_badge` — no
  fan-out needed for addresses. Orders/wishlist/notification counts are still not aggregated; fetch
  those separately.

## Phase 8 — Vendor management (F10)

- Backend scan: **buildable now; hardened later** — `/currentUser` exposes `store_id` (via the
  `usertype` accessor); `/userBalance` exists. Payouts work as the old app calls them; authorization
  on `/userBalance`/banks/transfers is post-release hardening.

## Phase 9 — Custom orders (F13)

- Enable the product-detail "Custom size" flag; OrderStatusStepper custom-order flow.
- Backend scan: **buildable now; hardened later** — `/approveCustom` + `/getStoreOrders` (custom)
  - `/updateOrder` work today (unauthenticated, as the old app uses them). Status is free-text (use
    the status normalizer). Keep the Custom size entry visible; the Phase 4→9 flag only sequences work.
    Authorization is post-release.

## Phase 10 — Messaging (F14)

- **Recommended before the content phases** (see note below). HTTP `MessagesTransport`; WebSocket
  swap later (`backlog.md`).
- Backend scan: `/getMessages` + `/createMessage` exist (confirmed), plus `/sse/messages` (SSE). No conversation list/unread — use HTTP + manual refresh; flag `hasConversationList` off.

## Phase 11 — Runway (F5), Makeup (F6), Fashion news (F12), Help & legal (F11)

- Backend scan: makeup = `/filterProducts` (category_id) + `/getAvailability` + `/addCoverageArea`; **forum has no data source** — mark "coming soon".

## Phase 12 — Hardening & release

- Accessibility audit; low-end Android performance; bundle size; store submission; beta rollout.
- Backend scan: —.

## Note: messaging vs content phases

**I recommend keeping messaging at Phase 10, before the content phases (Runway, Makeup, Fashion
news, Help).** Messaging is P0 (money/order trust), depends only on auth + API client + custom
orders + storefront/order entry points (all done by Phase 9), and is not blocked by the lower-value
P3 content phases. Moving it earlier restores vendor↔customer coordination sooner.
