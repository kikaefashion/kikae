# Screen spec — Home (`/`)

## Purpose & primary action

Home is the main **image-first product feed** (general, not personalized). Discover is
category-first, so Home never repeats Discover's category drill-down. **Primary action:** open a
product (tap a card); secondary: tap the wishlist heart.

## Data required (two queries)

1. `['home']` → `GET {apiUrl}/customer/v2/home` (public) with section limits as query params:
   `new_arrivals_limit=12&featured_limit=8&thrift_limit=8&freebies_limit=6&trending_limit=8&sponsored_limit=0&fashion_news_limit=0&runway_videos_limit=0`.
2. `['banners']` → `GET {apiUrl}/banners/all` (public), ordered by `position`. If it fails or is
   empty, the carousel is hidden silently (no retry button). Pull-to-refresh refetches both.

Only these home keys are consumed; every other key the backend returns is ignored:

| Section       | Field                 | Rendered as                                |
| ------------- | --------------------- | ------------------------------------------ |
| Category chips| `trending_categories` | horizontal chips (hide `product_count` 0)  |
| New in        | `new_arrivals`        | 4:5 product grid                           |
| Featured rail | `featured_products`   | horizontal rail (only when non-empty)      |
| Thrift rail   | `thrift_products`     | horizontal rail (only when non-empty)      |
| Free rail     | `freebies`            | horizontal rail (only when non-empty)      |

### Product fields

`id`, `name`, `price` (money), `old_price` (money, nullable), `status`, `units`, `thrift`
(nullable bool), `made_in_nigeria`, `ratings [{rating}]`, `store {id, name, logo}`, `media
[{url}]`, `likes [{user_id, like}]`. The schema declares only these fields; the private store data
the backend embeds never reaches state, logs or tests. Products are filtered to
`status === "approved"`. Image paths are relative (`profile-pic/x.webp`); one `mediaUrl` helper
resolves them against the media prefix (absolute URLs pass through unchanged).

### Wishlist heart

`POST {apiUrl}/likeProduct` `{product_id, user_id}` (public; add-only — no unlike route). Liked =
`likes.some(l => l.user_id === sessionUserId && (l.like === 1 || l.like === true))`.

## Banner carousel

- At the top of Home, above the chips. Separate `['banners']` query; hidden silently on error or
  empty. Order by `position`.
- Paging horizontal list. Ratio `img-banner` (16:9); at 768+ a wider `img-banner-wide` ratio (one
  token, no arbitrary values).
- Title + text overlaid on a solid `scrim` (the images do not contain the text). Autoplay ~6s with
  a visible pause/play button; no autoplay under reduced motion; autoplay stops after any user
  interaction and pauses while backgrounded or off screen. Prev/next buttons + labelled dots
  ("Slide 2 of 3"); keyboard left/right on web. Only the current and next images are loaded.
- Links: `"/"` → Makeup tab; `"/stores"` and `"/freebies"` → stub routes. Any other value is shown
  but not tappable.

## Layout

- Banner carousel → category chips → "New in" 4:5 grid → Featured / Thrift / Free rails (each only
  when non-empty). No vendor highlights row; no per-section retry.
- Columns from `useColumnCount` (never hand-rolled); 3–4 at `lg`. Grid is a `FlatList` with
  `numColumns`, remounted by `key` when the count changes. Rails are horizontal `FlatList`s with a
  fixed card width.

## Components

- **Existing:** `Skeleton`, `Price`, `Badge`, `EmptyState`, `ErrorState`, `OfflineState`,
  `InlineBanner`, `IconButton`, `Button`, `Chip`, `Text`, `Icon`, `Avatar`, `Image`.
- **New:** `ProductCard`, `SectionHeader`, `Carousel`.

## Card

- Shows name, store name, `Price` (`"Free"` when price is 0), strikethrough old price when
  `old_price > price`, **Thrift** badge (the only badge), **"Sold out"** when `units` is 0, and the
  rating summary (star + rounded average, shown only when ratings exist — never NaN). At most two
  overlays on the image (badge + sold-out).
- The card is a `Link` to `/product/[id]`. The heart is a **sibling** `IconButton` in the price
  row: price left, heart right (44px), label "Add to wishlist" → "Saved" (disabled once saved).

## States

- **Loading:** skeletons matching the layout (banner + 4:5 grid cards + chip skeletons) — never a
  spinner.
- **Empty:** all lists empty → `EmptyState` ("Nothing here yet") with Retry.
- **Error:** feed-level `ErrorState` with Retry; a failed refresh keeps already-loaded data.
- **Offline:** banner + cached sections stay visible.

## Interactions

- Tap card → `/product/[id]` (stub). Tap chip / "See all" → Discover tab (with a `categoryId`
  param). Banner tap → whitelist route. Guest heart tap → `requireAuth` with `redirectTo` back.
  Signed-in heart → optimistic save, disabled in-flight, rollback + toast on failure.

## Accessibility

- One `h1` ("Home"); section headers as `h2`; cards `role="link"` labelled name + price; heart
  labelled "Add to wishlist" → "Saved"; carousel slides/dots/buttons labelled; ≥44px targets;
  two-tone focus; 200% text.

## Test cases

1. Populated: home + banners render; exactly two requests on load; no extra requests.
2. Loading: skeletons match the layout (banner + grid + chips).
3. Empty: whole-feed `EmptyState` with Retry.
4. Error: `ErrorState` + Retry; a failed refresh keeps loaded sections.
5. Offline: banner + cached sections remain.
6. Banners fail/empty → carousel hidden, home still renders.
7. Carousel: ordering by position, whitelist links, pause/play, reduced motion, prev/next.
8. Liked derivation: heart reflects `likes[]` across repeated products.
9. Guest heart: navigates to `/login`; signed-in heart: optimistic save + rollback.
10. Hidden empty sections; no vendor row; card rating summary + single Thrift badge.
