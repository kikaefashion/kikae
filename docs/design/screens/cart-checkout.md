# Screen spec — Cart & checkout (`/cart`, `/checkout`, `/payment`)

## Purpose & primary action

Buy what's in the cart. **Primary action:** `/cart` change quantity / remove; `/checkout` pick an
address + delivery and pay; `/payment?reference=...` shows status and drives verify + recovery.
Money is the highest-scrutiny path: totals are server-computed and success is a server `verify`,
never a URL.

## Page template

Single column on phone; at `lg` (≥1024) two columns with a **sticky order summary** on the right
(items, subtotal, delivery, discount, total, Pay) and the flow on the left. All three routes sit
outside the tabs (tab bar / sidebar hidden, TopBar stays); a `ScreenHeader` heads each page. The
subtotal is labelled **"Estimated"**. Document titles: `Cart | Kikae`, `Checkout | Kikae`, and a
status-driven `Verifying | Kikae` / `Payment failed | Kikae` on the payment route.

## Server truth — the client never sends totals as authority

The client sends only choices (ids, units, area, coupon, address); the server re-computes totals,
delivery fees and discounts. The client never sends a total it computed, and never treats a URL or
`authorization_url` as proof of payment.

### Cart

- `POST {api}/addToCart` (auth) — `{units, product_id, size_id, color_id}` (normal item: measurement
  fields omitted, `isCustom` not sent).
- `POST {api}/getCart` — `{user_id}` → `data[]`, each line embedding `product` (`id, name, price,
old_price, units, status, isMakeup, thrift, media[{url}], sizes[{id,size}], colours[{id,name}]`)
  plus `id, units, size_id, color_id, isCustom, available_id`.
- `POST {api}/updateCart` — `{units, user_id, id, product_id}`; `POST {api}/removeFromCart` — `{id}`;
  `POST {api}/deleteCart` — `{user_id}`.

### Address (already on `/currentUser`)

Addresses arrive with the signed-in user (`GET/POST /currentUser` → `addresses`) — no fan-out. Add /
edit: `POST {api}/addUserAddress` / `/updateUserAddress` `{user_id, address, state_id, fname, lname,
phone, city, info, isDefault}`; delete: `POST {api}/deleteUserAddress` `{id}`.

### Delivery areas and fees

`GET {api}/uniqueLogisticState` → `POST {api}/uniqueLogisticStateArea` `{state_id}` →
`POST {api}/stateAreaLogistic` `{state_id, area}` (logistics). The fee is `logistic_destinations.cost`
keyed by an **`area_id`** — checkout sends `area_id` (never free text) to `/payments/initiate`.

### Payment initiate

`POST {api}/payments/initiate` (auth) — `{callback_url, cart_ids[] | products[] (product_id, units,
area_id), coupon_code, delivery_address, area_id, phone_number, city, state}` → Paystack
`authorization_url` + `reference`. Preflight `POST {api}/getPayment` `{products[], coupon_code}` →
`products_total, logistic_base_fee, extra_pickup_fee, extra_weight_fee, discount, final_total`.
`POST {api}/storeTransaction` does **not** exist — never call it; orders are created inside verify.

## Payment flow & recovery

`initiate → open Paystack (test mode only) → return → verify/{reference}`. The payment route is
`/payment?reference=...`: Paystack appends the reference to the callback URL, so the `callback_url`
sent to initiate is the bare `/payment` page (the old app pointed it at a bare
`/checkout/verification` page). Persist the `reference` **before** opening Paystack: a short list on
native via `expo-secure-store`; on web in `localStorage` — the reference list **only** (never tokens
or amounts). Verify each pending reference at most once per launch; drop on a terminal result or
after 24 hours. Call the idempotent `GET {api}/payments/verify/{reference}` (`processed` flag) — it
verifies Paystack + amount, creates orders, decrements stock, credits the vendor. The callback only
**triggers** verify, never proves success (the old `"payment-success"` match is dropped).

Native opens Paystack in `react-native-webview` (package approval in Slice C); closing the WebView is
`cancelled` plus one verify. Web redirects the full page.

**States:** `initiating` · `pending` · `verifying` ("Do not close this page") · `success` (clear
reference; show the reference + a Home link) · `failed` (Retry = re-verify) · `cancelled` ·
`timeout` · `unknown` (app killed — next launch re-verifies). Verify is idempotent.

**Zero-amount (free) orders** are settled by a staging experiment before this ships; a free product is not a zero-total order (delivery fees may still apply).

## Cart items

Quantity clamps to stock; `status !== "approved"` or `units === 0` renders unavailable/out-of-stock
and is excluded from checkout ids; remove (confirm); empty cart shows `EmptyState` with a Home link;
guests get `requireAuth`; offline keeps the cached list with a banner; a server `final_total`
differing from the listed price surfaces as a line note.

**Duplicates:** adding the same product, size and colour (with `isCustom === "0"`) updates the
existing line to `existing units + new units`, clamped to stock, through `updateCart`; the clamp
counts the SUM of units across all lines of that product. Pre-existing duplicate lines show as
returned.

**Old-app items** (detected by `isCustom` truthy `"1"` or `product.isMakeup` truthy — never the
measurement fields) show "Not available in this version" and are visibly excluded from checkout. A
line whose `product.price` is 0 shows "Free item: claim it from its page" with a link to
`/product/[id]`, excluded from checkout.

## Makeup & freebies (never in the cart)

Makeup (`product.isMakeup` truthy — **not** the category name; physical beauty products like
lipstick have `isMakeup` 0 and are normal) is never added to the cart; `addToCart` refuses it too.
Product detail shows no Add-to-cart bar; coverage + availability stay read-only with "Booking isn't
available in the app yet". A freebie (`price === 0`) is never added: its button is "Get for free" →
`/checkout?mode=buyNow&product=<id>&size=<size_id>&color=<color_id>&units=1` (ids only, never prices
or totals). Quantity fixed at 1; size/colour required when options exist; guests use `requireAuth`
with `redirectTo`. Slices B and C read the buy-now intent and send `products[]` to `/getPayment` and
`/payments/initiate` (**UNVERIFIED**: confirm initiate accepts `products[]` without a cart).

## Capability flags & Top bar

`cartEnabled` (false → flipped on by the Add-to-cart slice) hides Add to cart and gates `/cart`;
`customSizeEnabled` (false) hides the custom-size entry; makeup booking stays off. Until
`cartEnabled` flips, `/cart`, `/checkout` and `/payment` render a `ComingSoon` shell. Data cost:
one cart read, one preflight, three logistics calls, one initiate, one verify — no per-item product
fetches (the old N+1 is removed; the cart endpoint embeds `product`). The TopBar cart badge is the
sum of units of available lines, from the `['cart']` query when signed in and `cartEnabled`, with a
long stale time; hidden at 0.

## States & accessibility

Loading skeletons; empty cart; error + Retry; offline (cached cart/banner); not-approved /
out-of-stock item; price-changed note; no addresses / delivery area → prompt; payment
`initiating/pending/verifying/success/failed/cancelled/timeout/unknown`; invalid coupon. One `h1`
per screen; steppers labelled ("Increase quantity", "Decrease quantity"); remove labelled with the
product name; pickers are labelled selects; payment status via `accessibilityLiveRegion` (web);
≥44px targets; two-tone focus; 200% text; color never the only cue.

## Test cases (weighted toward payment safety)

1. Cart populated: one `/getCart`, zero per-item fetches; duplicate add merges and clamps across lines.
2. Old-app/freebie lines excluded from checkout ids and labelled; makeup/freebies never enter the cart.
3. Quantity change clamps at stock; update/remove in-flight; empty cart; guest → login.
4. Address from `/currentUser`; forgiving phone input; delivery state→area→logistic chain.
5. Initiate returns one `authorization_url` + `reference`; Pay disabled in-flight.
6. Verify on return + launch recovery; reference cleared on success, kept otherwise; idempotent.
7. Never infer success from a URL; `/storeTransaction` never called; client never sends totals.

## Slices

- **A — Cart (read, change quantity, remove) + Add to cart on product detail:** `cartEnabled` flips on.
- **B — Checkout address & delivery:** address picker/add form, chained delivery pickers, preflight.
  **Blocked** until real logistics responses confirm where `area_id` comes from.
- **C1 — Payment initiate, open Paystack, verify:** persist reference, idempotent verify, state machine.
- **C2 — Recovery:** launch-time re-verification of pending references.
- **D — Coupons & extras:** redeem/pick coupon, `coupon_message`, order-confirmation extras.

**Release gate:** the public release must not ship before Slice C (C1 + C2) is done.

## Questions (answered)

- Zero-amount (free) orders: settled by a staging experiment before building.
- Web reference storage: `localStorage` reference list only (see Payment flow).
- Unauthenticated `/payments/verify/{reference}`: accepted; logged in `backlog.md`.
- Folding the pickers into one `/getPayment` payload: logged in `backlog.md`.
- Stock running out between preflight and verify: ask the backend (logged in `backlog.md`).
