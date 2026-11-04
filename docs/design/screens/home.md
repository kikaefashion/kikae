# Screen spec — Home (`/`)

## Purpose & primary action

Home is the main **image-first product feed** (general, not personalized). Discover is
category-first, so Home never repeats Discover's category drill-down. **Primary action:** open a
product (tap a card); secondary: tap the wishlist heart.

## Data required (one request)

One TanStack Query key `['home']` → `GET {apiUrl}/customer/v2/home` (public) with section limits
as query params:

```
new_arrivals_limit=12&featured_limit=8&thrift_limit=8&freebies_limit=6&trending_limit=8&
sponsored_limit=0&fashion_news_limit=0&runway_videos_limit=0
```

Response envelope `{ status, message, data }`. Only these keys are consumed; every other key the
backend returns (e.g. `sponsored`, `fashion_news`, `runway_videos`) is ignored:

| Section       | Field                | Rendered as                                |
| ------------- | -------------------- | ------------------------------------------ |
| Category chips| `trending_categories`| horizontal chips (hide `product_count` 0)  |
| New in        | `new_arrivals`       | 4:5 product grid                           |
| Featured rail | `featured_products`  | horizontal rail (only when non-empty)      |
| Thrift rail   | `thrift_products`    | horizontal rail (only when non-empty)      |
| Free rail     | `freebies`           | horizontal rail (only when non-empty)      |

### Product fields

`id`, `name`, `price` (money), `old_price` (money, nullable), `status`, `units`, `thrift`
(nullable bool), `made_in_nigeria`, `rating` (number or null), `store {id, name, logo}`, `media
[{url}]`, `likes [{user_id, like}]`. The schema declares only these fields; the real payload embeds
private store data (owner email, phone, OTP `code`, password-like `hash`, `balance`, `addresses`)
which must never reach state, logs or tests. Products are filtered to `status === "approved"`.
Image paths are relative (`profile-pic/x.webp`); one `mediaUrl` helper resolves them against the
media prefix (absolute URLs pass through unchanged).

### Wishlist heart

`POST {apiUrl}/likeProduct` `{product_id, user_id}` (public; add-only — no unlike route). A
product's liked state is derived: `likes.some(l => l.user_id === sessionUserId && (l.like === 1 ||
l.like === true))`. The same product may appear in several sections, so all occurrences share the
same liked state.

## Layout

- Category chips (horizontal, scrollable) → then the "New in" 4:5 grid → then Featured / Thrift /
  Free horizontal rails, each rendered only when non-empty. No vendor highlights row (no store
  data), and no per-section retry.
- Columns from `useColumnCount` (never hand-rolled); 3–4 at `lg`. The grid is a `FlatList` with
  `numColumns`, **remounted by `key` when the column count changes**. Rails are horizontal
  `FlatList`s with a fixed card width.

## Components

- **Existing:** `Skeleton`, `Price`, `Badge`, `EmptyState`, `ErrorState`, `OfflineState`,
  `InlineBanner`, `IconButton`, `Button`, `Chip`, `Text`, `Icon`, `Avatar`.
- **New:** `ProductCard`, `SectionHeader`, `Image` (skeleton placeholder + error fallback).

## Card

- Shows name, store name, `Price` (`"Free"` when price is 0), strikethrough old price when
  `old_price > price`, **Thrift** and **Made in Nigeria** badges, **"Sold out"** when `units` is 0.
  Hides the rating when `null`. At most two overlays on the image (badges + sold-out).
- The card is a `Link` to `/product/[id]`; the heart is a **sibling** `IconButton` with the label
  "Add to wishlist" → "Saved" (disabled once saved).

## States

- **Loading:** skeletons matching the layout exactly (4:5 grid cards + chip skeletons) — never a
  spinner.
- **Empty:** all lists empty → `EmptyState` ("Nothing here yet") with Retry.
- **Error:** feed-level `ErrorState` with Retry; a failed refresh keeps already-loaded data.
- **Offline:** `OfflineState` banner on top + already-cached sections stay visible.

## Interactions

- Tap card → `/product/[id]` (stub). Tap chip / "See all" → Discover tab (with a `categoryId`
  param). Guest heart tap → `requireAuth` with `redirectTo` back (no `likeProduct` call).
  Signed-in heart → optimistic save, disabled in-flight (add-only), rollback + toast on failure.

## Accessibility

- One `h1` ("Home"); section headers as `h2`; cards `role="link"` labelled name + price; heart
  labelled "Add to wishlist" → "Saved"; ≥44px targets; two-tone focus; 200% text.

## Test cases

1. Populated: one `customer/v2/home` response renders chips + grid + rails; no extra requests.
2. Loading: skeletons match the layout (no shift, no spinner).
3. Empty: whole-feed `EmptyState` with Retry.
4. Error: `ErrorState` + Retry; a failed refresh keeps loaded sections.
5. Offline: banner + cached sections remain.
6. Liked derivation: heart reflects `likes[]` across repeated products.
7. Guest heart: navigates to `/login` with `redirectTo`, no `likeProduct` call.
8. Signed-in heart: optimistic save, disabled in-flight; rollback + toast on failure.
9. Hidden empty sections; no vendor row.
