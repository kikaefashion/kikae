# Screen spec — Home (`/`)

## Purpose & primary action

Home is the main **image-first feed** (general, not personalized). Discover is category-first, so
Home never repeats Discover's category drill-down. **Primary action:** open a product (tap a card);
secondary: tap the wishlist heart.

## Changes from old version

Approved in `audit.md` F2 (Poor — redesign + reimplement):

- Rebuild as one virtualized `SectionList` (three sections) with pull-to-refresh and per-section
  skeleton placeholders.
- TanStack Query everywhere; dedupe to the single `customer/v2/home` payload and drop the extra
  `beauty`/`hair`/`made_in_nigeria` `getProducts` calls; drop `getBanners`, `fashion-news`, and
  runway from Home (those live in their own tabs/screens).
- Capability flags: `hasPagination = false`, `canUnlike = false`, `canResizeImages = false`; no
  blurhash → skeleton placeholders + `expo-image` caching.
- Feed-level loading/error/empty/offline states with retry, plus per-section empty handling.
- Shared `ProductCard` (grid) + `useColumnCount` replace `ShirtCard` and duplicated `numColumns`.
- `formatNaira` (₦) fixes the wrong `N{…}` symbol; fix rating `NaN`; auth-gate the heart.
- Monochrome restyle: gray surfaces + borders, no gradients/shadows; solid scrim/tone step only.

## Layout

Template: **feed/grid** (uniform 4:5 `ProductCard` grid) — Home is a product feed, not
variable-height discovery. Column counts from `useColumnCount` (`layout-system.md` §2).

**Mobile (<640) — 2 cols**

```
┌──────────────────────────┐
│ Vendor highlights ▸▸▸▸  │  ← StoreCircle row (horizontal)
├──────────────────────────┤
│ Trending  [chip][chip]   │  ← Category rail (chips)
├──────────────────────────┤
│ New in        [See all]  │
│ ┌─────────┐ ┌─────────┐  │
│ │  card   │ │  card   │  │  ← 4:5 grid
│ └─────────┘ └─────────┘  │
│ ┌─────────┐ ┌─────────┐  │
│ │  card   │ │  card   │  │
│ └─────────┘ └─────────┘  │
│        [Load more]       │
└──────────────────────────┘
```

**Tablet (768–1023) — 4 cols; Desktop (≥1024) — 4 cols (lg) / 5 cols (xl+)**

```
┌───────────────────────────────────────────────┐
│ Vendor highlights ▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸        │
│ Trending  [chip][chip][chip][chip]            │
│ New in                             [See all]  │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│ │ card │ │ card │ │ card │ │ card │   (4)     │
│ └──────┘ └──────┘ └──────┘ └──────┘          │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│ │ card │ │ card │ │ card │ │ card │   (5 at xl)│
│ └──────┘ └──────┘ └──────┘ └──────┘          │
│                    [Load more]                │
└───────────────────────────────────────────────┘
```

Nav: bottom tab bar (<1024) / left sidebar (≥1024); TopBar carries the global SearchBar/Cart.

## Components

- **Existing (built in `src/components/ui`):** `Skeleton`, `Price`, `Badge`, `EmptyState`,
  `ErrorState`, `OfflineState`, `InlineBanner`, `IconButton`, `Button`, `Chip`, `Text`, `Icon`,
  `Avatar`.
- **New (specified in `components.md`, not yet implemented):** `ProductCard` (grid 4:5 variant),
  `StoreCircle`, `SectionHeader`, `Image` (skeleton placeholder + error fallback), and `SearchBar`
  (TopBar chrome, not the feed body).

## Data required (one request)

One TanStack Query key `['home']` → `GET {apiUrl}/customer/v2/home` (public, `api.php:1384`) with
the three section limits as query params in a single call. No pagination — lists are full sets
(`->get()`, `ORDER BY id DESC`); slice client-side. Response = `{ status, message, data }`.

| Section               | Query / field          | Fields used                                                   | Status                                                  |
| --------------------- | ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| Vendor highlights row | `sponsored=<limit>`    | store `id`, `name`, `image`                                   | **needs confirmation** (stores vs products? exact keys) |
| Category rail         | `trending=<limit>`     | category `id`, `name`                                         | **needs confirmation** (categories vs products?)        |
| Product feed          | `new_arrivals=<limit>` | product `id`, `name`, `price`, `image`, `rating`, vendor name | **needs confirmation** (exact keys)                     |

Wishlist heart: `POST {apiUrl}/likeProduct` `{product_id, user_id}` (public; add-only —
`canUnlike = false`, no unlike route in `ProductlikesController`).

Fallbacks (only if `customer/v2/home` lacks a section): vendor highlights → `GET /getStores`
(GET auth contradictory — see §13, **needs confirmation**); category rail → `GET /getProductCategories`.

## Data cost

- **Images:** request the original URL (`canResizeImages = false` — no server-side resize), render
  via `expo-image` with `contentFit: cover` and memory+disk cache, over a 4:5 `Skeleton` (no blurhash).
- **Stale times:** `staleTime` 5 min + `placeholderData: keepPreviousData` so tab re-entry never
  re-skeletons; pull-to-refresh or Retry forces refetch. The heart invalidates only the like state.

## States

- **Loading:** 4:5 `Skeleton` cards in the grid + `Skeleton` StoreCircle row + chip skeletons,
  matching final layout exactly — never a spinner.
- **Empty:** whole feed empty → `EmptyState` ("Nothing here yet") with Retry; a single empty section
  hides its header and row.
- **Error:** feed-level `ErrorState` with Retry; keep already-loaded section data on a failed refresh.
- **Offline:** `OfflineState` banner on top + already-cached sections stay visible (stale data).
- **Partial failure:** one section fails while others show → per-section inline error with its own
  Retry (re-fetch only that section).
- **Guest heart:** tap → auth prompt (login with `redirectTo`), no `likeProduct` call. Signed-in →
  optimistic save, single `likeProduct`, disabled while in-flight (add-only, no toggle back).

## Interactions, transitions, keyboard

- Tap card → `/product/[id]`; tap vendor circle → storefront; tap chip → `/categories?section=…`.
- Pull-to-refresh; "Load more" appends the next client-side slice; `SectionList` mounts only visible
  cards. Pressed scale/opacity; hover (web) one-step tone; two-tone focus; reduced motion honored.

## Accessibility

- One `h1` ("Home"); section headers as `h2`; reading order: highlights → categories → feed.
- Cards `role="link"` labelled name + price; heart is a **sibling** labelled "Add to wishlist" →
  "Saved"; circles labelled "Store: {name}"; chips labelled; ≥44px targets; two-tone focus; 200% text.

## Test cases

1. Populated: three sections render from one `customer/v2/home` response; no extra
   product/category/banner requests fire.
2. Loading: skeletons match the grid/row/chip layout exactly (no shift, no spinner).
3. Empty: whole-feed `EmptyState` with Retry.
4. Error: `ErrorState` + Retry refetches; a failed refresh keeps already-loaded sections.
5. Offline: `OfflineState` banner + cached sections remain visible.
6. Partial failure: one section's error shows its own Retry while the other two still render.
7. Guest heart: tapping heart prompts login (`redirectTo` back), no `likeProduct` request.
8. Signed-in heart: optimistic save, single `likeProduct`, disabled while in-flight (add-only).
9. Load more: appends the next slice; button hides when all items are shown.
10. Accessibility: card link label, heart announcement, circle labels, focus order, 200% text.

## Questions

- Exact response shape/field names of `customer/v2/home` (`sponsored`/`trending`/`new_arrivals`) —
  the audit names sections but not keys; confirm before typing the client.
- Does `sponsored` return stores (vendor highlights) or products? Does `trending` return categories
  or products? (Fallbacks listed above if not.)
- Already-liked state on the feed: is there a cheap public per-user likes source, or should the
  heart simply be disabled after save until product detail?
