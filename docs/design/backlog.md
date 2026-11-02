# Kikae — Post-rebuild backlog

Items deferred until after the monochrome rebuild. Each item lists the affected feature and
what would change. None of these are in scope for the first rebuild pass.

## Custom orders (F13)

- **Customer cancellation** — allow the customer to cancel a custom order before the vendor
  starts production (new state + transition; needs a new endpoint or an extension of
  `/updateOrder`).
- **Dispute path** — a formal raise/respond/resolve flow when customer and vendor disagree.
  (Backend scan: reject → refund is **not implemented** — `/approveCustom` only sets `approvedCustom`
  and does not refund on decline.)
- **"In production" stage** — split the current gap between "approved" and "ready_for_delivery"
  so the customer can see the order is being made.
- **Delivery deadline** — show an estimated/agreed delivery date on the order and stepper.
- **Customer receipt confirmation before `settled`** — require the customer to confirm receipt
  before the order moves to `settled` (today `settled` is customer-triggered for makeup, and
  auto-set by an hourly console command for delivered orders — **not** vendor-triggered).
- **Who triggers `settled` / vendor payouts** — **answered**: `settled` is set by (1) the customer
  (makeup, via `/updateOrder` from `service_pending`) and (2) the hourly `order:settlement` console
  command (auto-settles `delivered` orders past `settle_in`). Vendor balance is credited at payment
  verification, not delivery; withdrawal is gated on settlement (`withdrawable_balance =
store.balance − unsettledAmount`). See `docs/backend-findings.md` (Backlog check).

## Messaging (F14)

- **Real-time messaging over WebSockets** — today the backend only offers SSE (`/sse/messages`)
  - FCM push; once WebSockets are added, swap the HTTP `MessagesTransport` for a WebSocket transport
    behind the same `useMessages(threadId)` interface (screens unchanged). Removes the manual-refresh
    model.
- **Conversation list, unread counts, read receipts, attachments, order linking** — all
  "needs confirmation": build the UI shells so they appear when the backend adds support, but
  no endpoints are invented here.

## Trust & social

- **Vendor verification badge** — a verified-vendor signal needs a backend field; do not invent one
  (see `design-principles.md` Trust & clarity).
- **Save boards / collections** — Pinterest-style saving beyond the current wishlist.
- **Story-style vendor highlights** — the stores row is currently static circles; auto-playing
  highlights are a later enhancement.
- **Push notifications for messages** — **supported**: `/createMessage` sends FCM push to the
  recipient's `device_tokens` (no change needed).

## Payments (F8)

- **Server-initiated payment recovery** — a short-lived server session keyed by `tx_ref` as the
  web equivalent of the native SecureStore reference, so a web payment can be resumed after a
  browser close/refresh without relying on `localStorage`. (Backend scan: the `Payment` row keyed by
  `reference` is the recovery anchor and `/payments/verify/{reference}` is idempotent/re-runnable —
  no dedicated `tx_ref` session endpoint yet.)

## Testing & tooling

- **Route smoke tests (Playwright)** — once Playwright is set up in CI, add real browser smoke
  tests asserting `/`, `/explore`, and `/design-system` load directly, survive a web refresh (SSR
  deep-link), and browser back works. Today these routes are guarded only by a structural test
  (`src/__tests__/routing.test.ts`), not a live render.

---

## Backend work after rebuild (prioritized)

**Minimum security gate — ordered tiers (each tier gates the next):**

**(a) Account takeover (P0 — block release):**

- `/updatePassword`, `/forgotPassword`, `/adminUpdateUser`, `/deleteUserAccount`, `/getUser` (by
  email): add `auth:sanctum` + ownership.
- `/updatePassword` must require the OTP from `/sendCode`/`/verifyCode` (or `current_password`) and
  be scoped to the authenticated user; add OTP expiry + attempt throttling.
- Rotate the hard-coded config secrets (`config/database.php:53`, `routes/web.php:27`).
- Hide `code`, `email_verification_code` and `provider_id` in the User serialization (they are
  currently returned by `/currentUser`; the app already strips them client-side, but the backend
  must stop exposing them).

**(b) Money & personal data (P0 — block release):**

- Addresses (CRUD), orders (`/createOrder`, `/getUserOrders`, `/getStoreOrders`, `/getOrders`,
  `/approveCustom`), cart reads/mutations, banks and transfers, `/userBalance`: add `auth:sanctum`
  - ownership.
- Restrict CORS from `*`.

**(c) The rest (P1 — before public trust):**

- Likes, reviews, ratings, comments, follow, and messaging **including SSE**. Note: **`EventSource`
  cannot send an `Authorization` header** — SSE auth needs a query-string token or cookie.
- Remove/fix dead routes: `/payments/pending`, `/storeTransaction`, `/get-users-token`,
  `/maintanance-status`.
- Resolve schema drift and add the missing `payments`, `device_tokens`, `reviews` create-migrations.
- Return a machine-readable error code for login failure (e.g. `unverified`).

**Later (post-release):** pagination, unlike, conversation list/unread/read-receipts, image
resizing/CDN, structured area/LGA, login rate-limiting, order dispute/cancellation states,
`/searchProducts` `{products, stores}` shape.

> Full evidence in `docs/backend-findings.md` (Account-takeover surface · Required doc updates).
