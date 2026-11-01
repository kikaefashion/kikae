# Kikae — Feature Quality Audit

Audit of the existing app (reference project `kikaeFrontend`, Expo SDK 55) against the
rubric below, informing the monochrome redesign. All file paths cite the old project
unless stated otherwise. Read in parallel with `docs/inventory.md`.

## Summary (prioritized)

| #   | Feature                                     | Rating            | Effort | Risk   | Behavior change? | Backend impact                                      |
| --- | ------------------------------------------- | ----------------- | ------ | ------ | ---------------- | --------------------------------------------------- |
| 1   | F8 · Cart, checkout & payment               | **Poor**          | High   | High   | Yes              | None required (server-side checks listed below)     |
| 2   | F1b · Auth: register, verify, reset, Google | **Poor**          | Medium | Low    | Yes              | Needs backend work (OTP expiry, `/updatePassword`)  |
| 3   | F13 · Custom orders                         | **Poor**          | Medium | Medium | Yes              | Needs backend work (`/approveCustom` authorization) |
| 4   | F14 · Messaging (deleted)                   | **Poor**          | High   | High   | Yes              | Confirmed (endpoints exist; only screens removed)   |
| 5   | F2 · Home feed                              | **Poor**          | High   | Medium | Yes              | None required                                       |
| 6   | F10 · Vendor management                     | **Poor**          | High   | Medium | Yes              | None required                                       |
| 7   | F4 · Product detail & engagement            | **Poor**          | Medium | Medium | Yes              | Needs backend work (unlike)                         |
| 8   | F3b · Discover, search & image search       | **Poor**          | High   | Medium | Yes              | None required                                       |
| 9   | F9 · Profile & account                      | **Poor**          | Medium | Medium | Yes              | None required                                       |
| 10  | F7 · Stores directory & storefront          | Needs improvement | Medium | Low    | Yes              | Confirmed (`store_id` accepted)                     |
| 11  | F1a · Email/password login                  | Needs improvement | Low    | Low    | No               | None required                                       |
| 12  | F3a · Categories browsing                   | Needs improvement | Medium | Low    | Yes              | None required                                       |
| 13  | F5 · Runway (video)                         | Needs improvement | Medium | Low    | Yes              | None required                                       |
| 14  | F6 · Makeup services                        | Needs improvement | Low    | Low    | Yes              | None required                                       |
| 15  | F11 · Help, support & legal                 | Needs improvement | Low    | Low    | Yes              | None required                                       |
| 16  | F12 · Fashion news                          | Needs improvement | Low    | Low    | Yes              | None required                                       |

**Priority logic:** money/PII paths first (F8, F1b, F13, F14), then the core shopping surfaces
(F2, F10, F4, F3b), then account/trust (F9, F7), then media/edge content (F1a, F3a, F5, F6, F11,
F12). No feature was rated _Good_ — every one needs at least a monochrome restyle; nine need
redesign + reimplementation. All fixes are achievable with the existing API where noted; anything
that depends on unverified endpoint behavior is marked "needs confirmation" and consolidated in
the Backend recommendations section at the end.

## Rubric

Each feature is rated against six areas:

1. **UX** — confusing flow, too many steps, unclear primary action, inconsistent
   patterns, missing loading/success/error/empty feedback.
2. **Visual design** — clutter, inconsistent spacing/typography, weak hierarchy, poor
   contrast, not responsive.
3. **Accessibility** — missing labels/roles, small touch targets, keyboard/screen-reader gaps.
4. **Implementation** — `any`/untyped data, duplicated logic, giant components, business
   logic in UI, prop drilling, missing error handling, race conditions, memory leaks,
   unoptimized lists, no tests.
5. **Data & security** — unvalidated responses, tokens/PII stored or logged insecurely,
   client-side-only validation of important rules.
6. **Edge cases** — offline, slow network, long text, zero/huge lists, denied permissions,
   interrupted flows.

**Rating legend**

- **Good** — keep the behavior, restyle only.
- **Needs improvement** — keep the behavior, fix quality gaps + restyle.
- **Poor** — redesign and reimplement (listed here for approval before its spec is written).

---

## Feature audit

### F1a. Email/password login

**Rating: Needs improvement** — the login flow works; keep the behavior, restyle and fix quality.

**Screens:** `/login`.

**Problems found**

| #   | Area           | Problem                                                                                                                                                              | Evidence                                             |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | Visual         | Hard-coded blue (`royalBlue`), `#000` header block; bundled custom fonts (`font-appBold`/`font-appRegular`), violating system-font + monochrome rules.               | `src/app/login.tsx`, `src/utils/color.ts`            |
| 2   | Accessibility  | Icon-only password toggle has no label/role; "Forgot Password?"/"Signup Instead" are small text with no touch padding; inputs lack `textContentType`/`autoComplete`. | `src/components/FloatingLabelInput.tsx`, `login.tsx` |
| 3   | Implementation | Uses a Zustand form slice instead of `react-hook-form`/local state; mixed toast systems; `catch` swallows errors (generic toast only).                               | `login.tsx` (51–78); `src/networking/login.ts`       |
| 4   | UX             | "Continue as guest" navigates home without a real guest-session flag.                                                                                                | `login.tsx` (153–159)                                |

**Proposed fix**

- Convert to `react-hook-form` + `zod` with inline errors; monochrome restyle (system fonts,
  gray surfaces, black primary button); add `textContentType`/`autoComplete` + an accessible toggle.
- Unify to one toast module; keep the existing `/login` → `/currentUser` behavior.

**Backend impact:** none required (`/login`, `/currentUser`).

**Risk & effort:** Low effort, low risk.

**Changes user-facing behavior:** No (restyle + quality only).

### F1b. Registration, email verification, password reset & Google sign-in

**Rating: Poor** (redesign + reimplement). Registration/verification/reset/social have material defects.

**Screens:** `/onboarding`, `/register`, `/verify_email`, `/reset_password` (+ Google button on `/login`).

**Problems found**

| #   | Area                | Problem                                                                                                                                                                                                                    | Evidence                                                                       |
| --- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | UX / Implementation | **Google sign-in never renders on native.** The component returns `undefined` on Android and iOS, so the button exists only on web — despite `@react-native-google-signin/google-signin` being in `package.json` (unused). | `src/components/GoogleSignin.tsx`                                              |
| 2   | Implementation      | Navigation side-effect lives inside the networking layer (`router.push("/login")` after verification) instead of the screen.                                                                                               | `src/networking/verifyVerificationCode.ts`                                     |
| 3   | Data & security     | **PII + passwords logged to console.** Registration logs email, password, phone, address on request and again on error. Google auth logs the full auth request/response.                                                   | `src/networking/register.ts` (17–26, 49–57); `src/components/GoogleSignin.tsx` |
| 4   | Data & security     | Social login never persists a token (`saveAuthToken` commented out) and the endpoint response is unvalidated.                                                                                                              | `src/networking/socialLogin.ts`                                                |
| 5   | UX                  | Verify-email forces a second manual login: after verification it pre-fills login but pushes the user to `/login` instead of logging them in.                                                                               | `src/components/Register/VerifyEmail.tsx` (35–44)                              |
| 6   | UX                  | Registration validation incoherent — `isFieldEmpty` is only true when _every_ field is empty at once, so submit enables with a single field filled; no inline errors (only a duplicate toast on email-exists).             | `src/components/Register/Register.tsx` (70–77); `register.ts` (61–62)          |
| 7   | UX                  | Phone validation skipped entirely on web.                                                                                                                                                                                  | `src/functions/checkIsPhoneNumberValid.ts`                                     |
| 8   | Visual              | Hard-coded blue (`royalBlue`), `#0000ff` checkboxes, `#000` header blocks; bundled custom fonts.                                                                                                                           | `Register.tsx`, `verify_email.tsx`, `reset_password.tsx`                       |
| 9   | Accessibility       | Text links ("Login Instead", "Skip") small with no touch padding; inputs lack `textContentType`/`autoComplete`.                                                                                                            | `Register.tsx`, `reset_password.tsx`                                           |
| 10  | Implementation      | Four different toast systems across these flows; several files call two at once.                                                                                                                                           | `register.ts`, `sendCode.ts`, `verifyCode.ts`, `updatePassword.ts`             |
| 11  | Implementation      | Duplicate `updatePassword` wrapper (root + `forgotPassword/`) with different body shapes; duplicate `socialLogin.ts` (root + `socialLogin/`).                                                                              | `src/networking/`                                                              |
| 12  | Edge cases          | Broken `catch { console; }` handlers swallow network failures silently; no offline state, no retry.                                                                                                                        | `src/networking/sendCode.ts`, `sendVerificationCode.ts`                        |
| 13  | Visual/UX           | Onboarding "Start Shopping" appears only on the final slide and uses a 600ms `setTimeout` throttle.                                                                                                                        | `src/components/Onboarding/Onboarding.tsx`                                     |
| 14  | UX                  | Password-strength "checkboxes" are static, blue-colored `expo-checkbox` widgets — noise, not guidance.                                                                                                                     | `Register.tsx` (241–289)                                                       |

**Proposed fix**

- Reimplement on `react-hook-form` + `zod`: schemas with inline errors; drop the Zustand form slices.
- Restore Google sign-in on iOS/Android/Web via one `GoogleSignin` component using the correct
  native + web providers (keep `POST /social-login/google`) and persist the returned token.
- Auto-login after email verification (account already created) — navigate straight to home.
- Remove all PII/password console logging; typed API client with `zod` response parsing; one toast
  module; consolidate duplicate wrappers; fix the `catch { console; }` handlers.
- Monochrome restyle + accessibility (labels/roles, ≥44px targets, `autoComplete`).

**Backend impact:** needs backend work — `/social-login/google` is confirmed to return `token` +
user in one round-trip; but the email-verification/reset OTP has **no expiry** and `/updatePassword`
does **not** verify the code (see `docs/backend-findings.md` — Auth / Account-takeover surface).

**Risk & effort:** Medium effort, low risk. Fixes restore already-intended behavior.

**Changes user-facing behavior:** Yes — Google login becomes available on native; verified users
are logged in automatically instead of re-logging in.

**Backend recommendations:** standardize error shapes (client branches on string literals like
`"validation.email"`); return token + user from `social-login/google` in one round-trip.

### F2. Home feed

**Rating: Poor** (redesign + reimplement). Good intent (skeletons, `expo-image`
placeholders, blurhash, runway poster thumbnails), but the architecture and details
fall short for the core screen.

**Screens:** `/` (`(tabs)/index.tsx`) and its section components.

**Problems found**

| #   | Area           | Problem                                                                                                                                                                                                                                                   | Evidence                                                                                    |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Implementation | Home is an **empty `FlatList`** (`data` is a dummy array) whose entire feed is a single `ListHeaderComponent`. All ~10 sections mount at once, nothing is virtualized, and there's no pull-to-refresh.                                                    | `src/app/(tabs)/index.tsx`                                                                  |
| 2   | Implementation | `HomePage` is a ~435-line component holding 12+ local `useState`s; it refetches 6+ endpoints on **every focus** via `useFocusEffect` — no cache, so each tab visit re-skeletons the whole page. React Query is available but only used for banners.       | `src/components/home/HomePage.tsx`; `src/hooks/useBanners.tsx`                              |
| 3   | Implementation | Redundant fetches: `getCustomerHomeV2` already returns thrift/featured/freebies/new-arrivals/trending/runway/fashion-news, yet the page also calls `getBeautyProducts`/`getHairProducts`/`getMadeInNigeria` with hard-coded category IDs (`5`, `7`, `8`). | `HomePage.tsx` (180–189); `src/networking/getProducts.ts`                                   |
| 4   | Edge cases     | No feed-level error/offline/retry state. Sections silently `return null` when empty, and a failed `home v2` call leaves a mostly blank page.                                                                                                              | `HomePage.tsx` (234, 30–33 in `getCustomerHomeV2.ts`)                                       |
| 5   | Visual         | **Wrong currency symbol** — `N{price.toLocaleString()}` instead of `₦` with shared formatting.                                                                                                                                                            | `src/components/ShirtCard.tsx` (115)                                                        |
| 6   | Implementation | Rating math yields `NaN` when `ratings` is undefined (optional chaining then `Math.round`).                                                                                                                                                               | `ShirtCard.tsx` (53–57)                                                                     |
| 7   | UX             | Wishlist heart fires `likeProduct` with no auth guard; `userId` may be undefined for guests.                                                                                                                                                              | `ShirtCard.tsx` (37–49)                                                                     |
| 8   | Accessibility  | Card pressables, like icon, carousel slides/dots have no accessible labels/roles; `TrendingCategories` has an inert font class (`appRegular` missing `font-`).                                                                                            | `ShirtCard.tsx`, `Carousel.tsx`, `TrendingCategories.tsx`                                   |
| 9   | Visual         | Monochrome violations: `bg-royalBlue` badges, an `expo-linear-gradient` scrim on the carousel, `shadow-md`, bundled placeholder images, hard-coded `#E0E0E0`/`#222`/`#eee`.                                                                               | `Carousel.tsx` (115–120), `TrendingCategories.tsx`, `SkeletonLoading.tsx`, `NewToKikae.tsx` |
| 10  | Implementation | Responsive `numColumns` (640/768/1024) duplicated across `HomePage`, `Thrift`, `Beauty`, `Hair`, `Makeup`; the section components re-fetch the same data with duplicated grid logic.                                                                      | `HomePage.tsx` (154–163), `home/Thrift.tsx`, `home/Beauty.tsx`                              |
| 11  | Data           | Untyped fields (`user?: Record<string, any>`, `comments: any[]`); `HomeProduct` duplicates `productData`.                                                                                                                                                 | `src/types/homeTypes.ts` (74, 201)                                                          |
| 12  | Implementation | `LazyImage` is not actually lazy (loads on mount); image strategies are mixed (`expo-image` direct vs `LazyImage`/`ImageOptimizer`).                                                                                                                      | `src/components/LazyImage.tsx` (24–29)                                                      |
| 13  | Implementation | Carousel uses `router.push(url as never)` type assertion and `Linking.openURL` for external URLs; autoplay ignores reduced-motion.                                                                                                                        | `Carousel.tsx` (41–48)                                                                      |
| 14  | UX             | "New to Kikae" links to hard-coded YouTube URLs with inconsistent icon colors.                                                                                                                                                                            | `NewToKikae.tsx` (8–31)                                                                     |

**Proposed fix**

- Rebuild as one **virtualized section list** (`SectionList`/`FlatList` with section items)
  with pull-to-refresh and per-section skeleton placeholders.
- Move all data to TanStack Query: `staleTime` + `keepPreviousData`; dedupe to the single
  `home v2` payload and drop the extra beauty/hair/nigeria calls (route "See All" to
  `/categories?section=…`).
- Add a feed-level loading/error/offline/empty state with retry, plus per-section empty handling.
- Ship a shared `ProductCard` + one responsive-grid helper (`useColumnCount`) to replace
  `ShirtCard` and the duplicated `numColumns` logic.
- Fix `₦` formatting via a single `formatNaira` util; fix rating math; guard the like action
  with an auth prompt; add labels/roles to cards, like, carousel, and dots.
- Monochrome restyle: gray surfaces + borders for elevation (no gradients/shadows), near-black
  text, keep image-led cards; replace the gradient scrim with a solid scrim/tone step.

**Backend impact:** none required. `customer/v2/home` already serves most sections.

**Risk & effort:** High effort (core screen rebuild), medium risk.

**Changes user-facing behavior:** Yes — smoother virtualized feed, fewer redundant requests,
correct ₦ prices, visible offline/error/retry states, auth-gated wishlist.

**Backend recommendations:** add `beauty`, `hair`, `made_in_nigeria` sections to
`customer/v2/home` so the client can fetch the whole feed in one request.

### F3a. Categories browsing

**Rating: Needs improvement** — the category drill-down (category → subcategory → product type)
works and paginates with cancellation; fix quality + restyle, keep the flow.

**Screens:** `/categories`, `/categories/products/[id]`.

**Problems found**

| #   | Area           | Problem                                                                                                                                                          | Evidence                                  |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 1   | Implementation | `getCategories` builds a **double `/api` path** (`${apiUrl}/api/v2/categories` when `apiUrl` already ends in `/api`) — broken call.                              | `src/networking/getCategories.ts` (5)     |
| 2   | Visual         | Category chips/rows use `border-royalBlue`/`bg-royalBlue`; loading spinners hard-code `#0000ff`; `numColumns` breakpoint logic duplicated again.                 | `CategoriesRow.tsx`, `CategoriesPage.tsx` |
| 3   | UX             | "See All" sections re-fetch data in standalone components (`Thrift`, `Beauty`, `Hair`, `Freebies`, `NigeriaMade`) instead of passing the already-loaded results. | `src/app/categories.tsx` (22–28, 66–82)   |
| 4   | Edge cases     | Categories `useEffect` has no error handling — a failed discovery fetch just leaves the spinner state unresolved (`finally` sets loading false, no error UI).    | `categories.tsx` (47–64)                  |
| 5   | UX             | Categories pagination has no skeleton for initial/next-page load (only a footer spinner) and no empty-state differentiation between "loading" and "no results".  | `CategoriesPage.tsx` (235–275)            |

**Proposed fix**

- Fix the `getCategories` double-`/api` bug; standardize chips on the token system.
- Pass loaded data to section components (or reuse the React Query cache) instead of re-fetching.
- Add loading/error/empty/offline states + a skeleton for pagination.
- Extract `useColumnCount` + `ProductCard` (once, shared with F2/F3b).

**Backend impact:** none required (`/customer/discovery/categories`, `/customer/discovery/products`, `/filterProducts`).

**Risk & effort:** Medium effort, low risk.

**Changes user-facing behavior:** Yes — real error/empty states and consistent category styling.

### F3b. Discover, search & image search

**Rating: Poor** — Discover is a differently-styled clone of Home; search results nest
virtualized lists with a type mismatch; image search is coupled to global state.

**Screens:** `/discover`, `/catalog`, `/image-search`.

**Problems found**

| #   | Area                | Problem                                                                                                                                                                                               | Evidence                                                                  |
| --- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | UX / Implementation | **Discover is a re-skinned Home** — it calls the same `customer/v2/home` endpoint and renders the same sections, just styled with a different (green) palette. Two tabs show near-identical content.  | `src/components/discover/DiscoverPage.tsx` (20, 40)                       |
| 2   | Visual              | Discover uses an off-brand green/gold palette (`#31594C`, `#1C2A25`, `#E2BE7E`) and `expo-linear-gradient` hero + decorative rotated circles — inconsistent with the monochrome brand.                | `DiscoverPage.tsx` (styles, 448–492)                                      |
| 3   | Implementation      | Search results nest a `FlatList` inside a `SectionList` `renderItem` (virtualized-in-virtualized) and reuse `index.toString()` keys across sections (key collisions).                                 | `src/app/catalog.tsx` (99–163)                                            |
| 4   | Data                | Search results typed as `Product` (`{ data: productData[] }`) but treated as a raw array (`results.products.length`, spread into sections) — type/impl mismatch; `search()` returns unvalidated data. | `catalog.tsx` (20–26, 70); `src/networking/filter/search.ts`              |
| 5   | Edge cases          | Catalog has no error/offline state — a failed search falls through to a misleading "No Results Found" empty state; loading is a raw spinner (`#0000ff`).                                              | `catalog.tsx` (47–49, 74–94)                                              |
| 6   | Implementation      | Image-search results are passed through **global Zustand state** (`imageSearchResults`), so a direct visit shows stale/empty data; only a spinner, no error/retry.                                    | `src/app/image-search.tsx` (22–25); `src/store/slice/imageSearchSlice.ts` |
| 7   | Implementation      | Image-search upload uses web-only `atob`/`Blob`/`File` and an `as any` cast for the native `FormData`; response cast via `as ImageSearchResponse` (no validation).                                    | `src/networking/imageSearch.ts` (14–22, 59)                               |

**Proposed fix**

- Reunify Discover and Home into one image-led feed backed by the same `home v2` data;
  give Discover a distinct role (e.g., category-first exploration) rather than a duplicate feed.
- Rebuild search results as a single `SectionList` (stores row + product grid in one list,
  no nested virtualized lists) with unique keys and a correct `SearchResponse` type validated by `zod`.
- Pass image-search results via route params/local state (not global store) or a React Query
  cache keyed by the upload; add error/retry/offline states.

**Backend impact:** none required (uses `/searchProducts`, `/customer/v2/home`, `/products/image-search`).

**Risk & effort:** High effort (three screens), medium risk.

**Changes user-facing behavior:** Yes — Discover no longer duplicates Home; search results
render correctly with real error states; image search results no longer leak between visits.

**Backend recommendations:** return a single typed `{ products, stores }` shape from
`/searchProducts`; consider a discovery-specific payload so Discover and Home don't share the
exact same feed.

### F4. Product detail & engagement

**Rating: Poor** — the detail page works but is a Zustand-coupled monolith; the
engagement actions (like, review, comments) have concrete bugs.

**Screens:** `/product/[product]`, `/product/comments/[productId]`,
`/product/reviews/[productId]`, `/review/[id]`, `/product/edit/[product]` (vendor — assessed in F10).

**Problems found**

| #   | Area            | Problem                                                                                                                                                                                 | Evidence                                                     |
| --- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | Data & security | A hard-coded Bearer token is left commented in source.                                                                                                                                  | `src/networking/getProductDetail.ts` (10)                    |
| 2   | UX              | `likeProduct` shows a **wrong, misleading toast** on failure — "You have been logged in." with `type: "success"`.                                                                       | `src/networking/likeProduct.ts` (39–42)                      |
| 3   | UX              | Wishlist "like" can only add, never unlike (always sends `like: true`); the card's `isLiked` heart state is computed but not reversible.                                                | `likeProduct.ts` (28–33); `ShirtCard.tsx` (43–49)            |
| 4   | Implementation  | `ProductDetails` is a large monolith mixing fetch, cart, like, comments, report, share, and 4 modals; comments are cached in Zustand for native but local state for web (split path).   | `src/components/product_details/ProductDetails.tsx`          |
| 5   | UX              | **Reviews screen shows the wrong data** — it fetches `getProductReviews` but then renders `productResult.data.ratings` (ratings, not reviews).                                          | `src/app/product/reviews/[productId].tsx` (43–52)            |
| 6   | Data            | Reviews map over `review: any`; star color hard-coded `"blue"`/`"gray"`; no fallback when `profilePic` is missing.                                                                      | `product/reviews/[productId].tsx` (97, 127, 105)             |
| 7   | UX              | Review form: client-only validation, passes route `id` straight into `createReview` as `product_id`, and **silently navigates back on error** (no feedback).                            | `src/app/review/[id].tsx` (34–54)                            |
| 8   | Implementation  | `createReview`/`likeProduct`/`getProductComments` log product/comment/user IDs to console; `createReview` assumes `getUser()` always returns a user (`user.data.id` throws for guests). | `createReview.ts` (11–16); `getProductComments.ts` (14)      |
| 9   | Implementation  | Comments screen imports `{ set }` from `react-hook-form` (unused) and renders **two toast systems** simultaneously; a `[]` fallback is recreated each render.                           | `product/comments/[productId].tsx` (18, 58–65, 244–245)      |
| 10  | UX              | Review form star icons pass `tintColor={item}` where `item` is `"1.0"…"5.0"` (not a color) — broken tint.                                                                               | `review/[id].tsx` (107)                                      |
| 11  | Implementation  | View tracking fires in a `useEffect` with an empty dep array (never re-runs if the param changes); body commented out so tracking relies on the URL path only.                          | `product/[product].tsx` (11–16); `increamentProductViews.ts` |
| 12  | Visual          | Monochrome violations throughout: `bg-royalBlue`, `text-royalBlue`, `color="#0000ff"`, blue/gray stars.                                                                                 | `ProductDetails.tsx`, reviews, review form                   |

**Proposed fix**

- Split `ProductDetails` into a screen + presentational pieces (gallery, info, footer,
  suggestions) and one `useProduct(productId)` query hook (React Query).
- Fix `likeProduct` to a real **toggle** (like/unlike) with correct messages and auth guard;
  keep wishlist state in the query cache, not the global store.
- Reviews screen must render `getProductReviews` data (not ratings) with typed models and
  star icons from the icon set (no color-only rating).
- Review form: typed schema, real submit error handling (inline + toast, no silent back-nav),
  and confirm the route param is the product id (fix the order-id/product-id confusion).
- Remove PII/IDs from console logs; **revoke + rotate the hard-coded Bearer token** left in
  `getProductDetail.ts` (it remains in git history).
- Unify toasts/notifications (one module); remove the unused `react-hook-form` import.

**Backend impact:** needs backend work — unlike is **not supported** (no `like:false`/`DELETE`
route); `/getReviews` **is** the canonical review list (confirmed, separate from ratings).
Endpoints used: `/getProduct/{id}`, `/likeProduct`, `/getProductLikes`, `/getProductComments`,
`/saveProductComment`, `/getReviews`, `/createReview`, `/reportProduct`, `/products/{id}/view`.

**Risk & effort:** Medium effort, medium risk (engagement actions are customer-facing trust signals).

**Changes user-facing behavior:** Yes — wishlist becomes reversible, reviews show actual
reviews, review submit shows real errors.

**Backend recommendations:** add a dedicated unlike/`DELETE` for product likes (or accept
`like: false`) and return the canonical review list from `/getReviews` (reviews ≠ ratings).

### F5. Runway (short video)

**Rating: Needs improvement** — the full-screen paging feed is performance-conscious
(conditional player mount, windowed rendering), but autoplay is unmetered and several
details are broken.

**Screens:** `/runway`, `/store/runway_videos/[id]`.

**Problems found**

| #   | Area             | Problem                                                                                                                                                                                                                 | Evidence                                         |
| --- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | UX / Performance | Videos **always autoplay, unmuted** (`loop=true; muted=false; play()`), with no Wi-Fi/data-saver control — the exact cost-sensitive-to-data issue to redesign (user-approved: Wi-Fi-only default, customer-changeable). | `src/components/runway/VideoPost.tsx` (46–49)    |
| 2   | UX               | Empty state "Refresh" button has **no `onPress`** — dead control.                                                                                                                                                       | `src/components/runway/RunwayFeed.tsx` (35)      |
| 3   | Edge cases       | No error/offline state: a failed fetch shows the empty state with a broken refresh; `getRunwayVideos` never checks `response.ok`.                                                                                       | `RunwayFeed.tsx` (132–146); `getRunwayVideos.ts` |
| 4   | Visual           | Monochrome violations: `royalBlue`/`#3b82f6` (like heart), `#0a0a0f`/`#1a1a2e` backgrounds, `expo-linear-gradient` overlay.                                                                                             | `RunwayFeed.tsx`, `VideoPost.tsx` (11, 249)      |
| 5   | Accessibility    | Like state is **color-only** (`#3b82f6` vs white heart) with a generic "Like video" label that doesn't change with state.                                                                                               | `VideoPost.tsx` (246–250)                        |
| 6   | Implementation   | Noisy `console.log`s of full result/video lists; likes use global `allRunwayVideos` state with no auth guard.                                                                                                           | `RunwayFeed.tsx` (135, 167); `VideoPost.tsx`     |
| 7   | Implementation   | Comments/likes have no loading or error feedback; comment save lacks an inline auth guard.                                                                                                                              | `VideoPost.tsx` (107+), `runwayLike.ts`          |

**Proposed fix**

- Add a data-saver policy: default **Wi-Fi-only autoplay** with a customer setting
  (in Settings + a control on the Runway screen) to allow cellular autoplay; keep tap-to-play
  as the manual path. Show a "paused — tap to play" affordance.
- Wire the empty-state Refresh button to the loader; add error/offline/retry states.
- Monochrome restyle: gray surfaces/borders for the rail, white on near-black for overlay text,
  replace the blue heart with a filled/outline black/white heart (label reflects state).
- Move runway videos into React Query, drop the global store list, add auth guards + feedback
  on like/comment.

**Backend impact:** none required (`/getBoomerangs`, `/runway/like/toggle`,
`/runway/likes`, `/getRunwayComments`, `/storeRunwayComments`).

**Risk & effort:** Medium effort, low risk.

**Changes user-facing behavior:** Yes — autoplay defaults to Wi-Fi-only (customer-changeable);
empty state refresh works; error/offline states appear.

### F6. Makeup services

**Rating: Needs improvement** — the tab is just another product grid, not a "services"
experience; it reuses the same duplicated grid pattern.

**Screens:** `/makeup`; makeup packages are also sold via `/store/add/[item]` (F10) and
checked out via the makeup confirmation/verification routes (F8).

**Problems found**

| #   | Area           | Problem                                                                                                                                                         | Evidence                                                      |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Implementation | `/makeup` renders `Makeup` — a bare product grid identical to Beauty/Hair/Thrift with duplicated `numColumns`, `ShirtCard`, `NoItems`, `ActivityIndicator`.     | `src/app/(tabs)/makeup.tsx`; `src/components/home/Makeup.tsx` |
| 2   | Implementation | `getMakeup` hard-codes `category_id: 5` to `/filterProducts` (magic id, brittle).                                                                               | `src/networking/getProducts.ts` (24–42)                       |
| 3   | UX             | No "services" framing (booking, coverage areas, studio vs home offer) despite the "makeup services" purpose; the tab is indistinguishable from a category grid. | `Makeup.tsx`                                                  |
| 4   | Visual         | `royalBlue` spinner; same wrong `N{price}` via `ShirtCard`; duplicated card-width classes.                                                                      | `Makeup.tsx`, `ShirtCard.tsx`                                 |

**Proposed fix**

- Reuse the shared `ProductCard` + `useColumnCount` (built for F2/F3) and drop the bespoke grid.
- Present makeup as a **service catalog** where it matters (offer type "home/studio", coverage
  areas) using the product data already returned — no new endpoints.

**Backend impact:** none required (uses `/filterProducts` with `category_id`).

**Risk & effort:** Low effort, low risk.

**Changes user-facing behavior:** Yes — makeup tab shows service-relevant info
(offer type, coverage) instead of a generic product grid.

**Backend recommendations:** a dedicated makeup-services endpoint returning packages with
coverage/availability would improve the experience; not required for the restyle.

### F7. Stores directory & storefront

**Rating: Needs improvement** — the storefront is one of the better-structured areas
(uses `useStoreHooks` + React Query), but has copy-paste bugs and toast/state mess; the
directory is a bare, non-responsive grid.

**Screens:** `/stores`, `/store/[store]`, `/store/runway_videos/[id]`.

**Problems found**

| #   | Area            | Problem                                                                                                                                                                                                         | Evidence                                                         |
| --- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | Implementation  | Storefront wraps its content in `FlatList data={[0]}` (dummy list) instead of a `ScrollView` — the home-screen anti-pattern repeated.                                                                           | `src/components/store/UsersStore/UserStore.tsx` (192–196)        |
| 2   | Implementation  | Copy-paste bug: `isStoreProductsLoading` is passed as `isStoreRunwayVideosLoading`.                                                                                                                             | `UserStore.tsx` (166)                                            |
| 3   | Data & security | `getSingleStore` logs the full store payload and uses wrong header casing (`Application/Json`); no `response.ok` check.                                                                                         | `src/networking/store/getSingleStore.ts` (16)                    |
| 4   | UX              | `followStore` uses **three toast systems** and double-toasts on the "not logged in" path; `unfollowStore` calls `getUser()` then `user.data.id` (throws for guests); both share the typo `"an error occuredr"`. | `followStore.ts` (5–13); `unfollowStore.ts` (8–9, 29)            |
| 5   | Implementation  | `getStoreLikes` fetches the **current user's own store** (`getUserStore().myStore.id`) rather than the store being viewed — wrong scope for a public storefront.                                                | `getStoreLikes.ts` (9–10)                                        |
| 6   | UX              | Stores directory has no empty/error state and hard-codes `numColumns={3}` with `w-[30%]` regardless of screen size (not responsive on tablet/web).                                                              | `src/components/store/StoreTab.tsx` (43–68)                      |
| 7   | Visual          | `royalBlue` FAB + `shadow-lg`; `bg-amber-400` approval banner and `bg-royalBlue` buttons (off-brand colors); `#0000ff` spinners.                                                                                | `UserStore.tsx` (185, 209, 228); `StoreTab.tsx`                  |
| 8   | Edge cases      | `daysLeft`/`targetDate` computed from an optional `singleStore` (NaN when undefined); `deleteBank` is fired without await/refetch.                                                                              | `UserStore.tsx` (78–84, 88–90)                                   |
| 9   | Implementation  | `incrementStoreVisits`/`getStoreProducts`/`getStores` skip `response.ok` checks and `console.log` payloads.                                                                                                     | `incrementStoreVisits.ts`, `getStoreProducts.ts`, `getStores.ts` |

**Proposed fix**

- Replace the dummy `FlatList` container with a `ScrollView`/`SectionList`; fix the
  runway-loading flag; guard `daysLeft` math.
- Consolidate follow/unfollow into a single `useFollowStore` mutation (React Query) with one
  toast, correct auth guard, and optimistic follow state.
- Fix `getStoreLikes` to take the viewed `store_id`; standardize store fetch headers + `ok` checks.
- Make the directory responsive via `useColumnCount` and add loading/empty/error/offline states.
- Monochrome restyle: token colors for FAB/buttons/status banner (status paired with icon+label).

**Backend impact:** confirmed — `/getStoreLikes` accepts an arbitrary viewed `store_id` (no auth),
but `/store/get/{id}` returns no `store_likes`/`followers`/`is_following` aggregate. Endpoints used:
`/getStores`, `/store/get/{id}`, `/getStoreProducts/{id}`, `/getStoreBoomerangs/{id}`,
`/storeFollower`, `/deleteFollowing`, `/getFollowers`, `/getStoreLikes`, `/incrementStoreVisits`.

**Risk & effort:** Medium effort, low risk.

**Changes user-facing behavior:** Yes — correct store-like counts, working follow/unfollow
feedback, responsive directory, real empty/error states.

**Backend recommendations:** return `store_likes`/`followers` counts and `is_following` directly
on `/store/get/{id}` to avoid the separate `/getStoreLikes`+`/getFollowers` round-trips.

### F8. Cart, checkout & payment

**Rating: Poor** — the money path works end-to-end but has the app's worst data-handling
defects (tokens and full orders logged) plus N+1 fetches, race conditions, and a fragile
WebView payment hand-off.

**Screens:** `/cart`, `/checkout/address/create`, `/checkout/confirmation`,
`/checkout/payment`, `/checkout/verification`, `/checkout/confirmation/makeup/[makeupId]`,
`/checkout/makeup/verification`.

**Problems found**

| #   | Area            | Problem                                                                                                                                                                                                                                            | Evidence                                                         |
| --- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | Data & security | **Auth token logged** to console in `addToCart`.                                                                                                                                                                                                   | `src/networking/cart/addToCart.ts` (27)                          |
| 2   | Data & security | `storeTransaction` logs the **entire order + PII** (amounts, tx_ref, userId, address, delivery address, order lines).                                                                                                                              | `src/networking/storeTransaction.ts` (43, 77–88)                 |
| 3   | Data & security | `initiatePayment` logs the full payment payload (cart_ids, phone, address) and returns `authorization_url` unvalidated.                                                                                                                            | `order/initiatePayment.ts` (25)                                  |
| 4   | Implementation  | Cart renders each item by **fetching product detail per item** (N+1 requests); the fetch effect depends on `isRemovingItem` (wrong dep) and dereferences `cartProduct.units` before load (race).                                                   | `src/components/Cart/CartItem.tsx` (47–54, 87)                   |
| 5   | UX              | Price shown as `₦ {itemPrice}` with no thousands separator, inconsistent with `ShirtCard`'s `N{…toLocaleString()}`; the existing `calculateCartTotal` util is bypassed.                                                                            | `CartItem.tsx` (155–156, 188)                                    |
| 6   | Implementation  | Three notification systems in one component (`Toast`, `showToast`, `NotificationManager`); empty `catch {}` in `Cart`; `keyExtractor` by index.                                                                                                    | `CartItem.tsx` (20–23); `Cart.tsx` (31–32, 52)                   |
| 7   | UX              | Payment is a raw `WebView` whose `onNavigationStateChange` matches `"payment-success"`/`"payment-cancel"` substrings (untyped `event`) and then `router.back()` — no verification call, no loading/error/offline state, fragile redirect handling. | `src/app/checkout/payment.tsx`                                   |
| 8   | UX              | No cart empty state (empty list + footer only); out-of-stock "In Stock/Out of Stock" is color-only blue text; remove/stepper buttons have no accessible labels.                                                                                    | `Cart.tsx`; `CartItem.tsx` (181–183, 197–233)                    |
| 9   | Implementation  | Address creation is a long chain of manual `showToast` guards (state/fname/lname/address/city/phone) with no submit-loading state; phone validation skipped on web.                                                                                | `src/app/checkout/address/create.tsx` (36–71)                    |
| 10  | Implementation  | `verifyPayment`/`getFullPayment`/`getCart` skip `response.ok` checks and `console.log` payloads; `getFullPayment` returns `coupon_message` unvalidated.                                                                                            | `order/verifyPayment.ts`, `getFullPayment.ts`, `cart/getCart.ts` |

**Proposed fix**

- Introduce a typed, `zod`-validated API client for the whole payment path; **remove every
  `console.log` of tokens/PII/orders**; never log the auth token.
- Rebuild the cart around one `useCart` query (cart endpoint already embeds `product`) —
  eliminate the per-item `getProductDetail` calls and the race by keying on `product_id`.
- Use a single `formatNaira` everywhere (₦ + thousands separators) and reuse `calculateCartTotal`.
- Replace the WebView substring match with a proper flow: `payments/initiate` → Paystack →
  redirect to `/checkout/verification` → `payments/verify/{reference}` (which creates the order
  server-side, idempotently), with explicit loading/error/offline/retry states and a "don't close
  this page" affordance. **`/storeTransaction` no longer exists — do not call it.**
- Add a cart empty state, token-colored stock badges (paired with label), accessible steppers/remove.
- Convert address creation to a `zod` schema with inline errors + submit loading.
- **Crash/disconnect recovery:** persist the payment `reference` (and order intent) before opening
  Paystack — `expo-secure-store` on native; web equivalent in the checkout spec (prefer a
  short-lived server session keyed by `tx_ref` rather than `localStorage`). On next launch, if an
  unverified reference exists, resume `payments/verify/{reference}` before re-initiating — never
  strand a payment between Paystack and order creation.
- **Idempotency:** disable pay/submit while in-flight; `/payments/verify/{reference}` is already
  idempotent (guarded by `processed` + `lockForUpdate`), so a re-run returns "already processed".

**Backend impact:** none required (`/getCart`, `/addToCart`, `/updateCart`,
`/removeFromCart`, `/getPayment`, `/payments/initiate`, `/payments/verify/{reference}`,
`/getUserAddresses`, `/addUserAddress`). `/storeTransaction` is commented out server-side —
order creation happens inside `/payments/verify/{reference}`.

**Risk & effort:** High effort, high risk (money + PII). Highest scrutiny; build after auth,
API client and cart.

**Changes user-facing behavior:** Yes — reliable payment verification, correct ₦ formatting,
clear cart/stock/error states; no visible flow change to Paystack itself.

**Backend recommendations (high priority):** create the order and re-check amounts server-side
(return the order id + `tx_ref` from `/payments/initiate` or a server-side order-create step), keep
`/payments/verify/{reference}` idempotent (it already is), and expose a verification-complete
webhook/redirect target so the client never infers success from a URL string.

### F9. Profile & account

**Rating: Poor** — large Zustand-coupled screens, duplicate profile routes, a wishlist that
never loads, and a notifications screen that can crash on empty data.

**Screens:** `/profile` (tab), `/profile/[profile]`, `/profile/edit`,
`/profile/address/add`, `/profile/address/edit/[addressId]`, `/profile/custom_orders/index`,
`/profile/order_details/[order]`, `/profile/promotion_details/[promotion]`, `/wishlists`,
`/customer/coupons`, `/notifications`, `/settings`.

**Problems found**

| #   | Area           | Problem                                                                                                                                                                                                         | Evidence                                                            |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Implementation | The profile tab and `/profile/[profile]` are near-duplicate screens, both wrapping content in a dummy `FlatList data={arrayData}` with `ListHeaderComponent`; `numColumns` is computed twice and mostly unused. | `(tabs)/profile.tsx`; `profile/[profile].tsx`                       |
| 2   | UX             | **Wishlist screen never fetches** — the `getProductLikes` effect is commented out, so it shows whatever global state happens to hold (empty for direct visits).                                                 | `src/app/wishlists.tsx` (33–45)                                     |
| 3   | Edge cases     | `new Date(DOB).toISOString()` in profile edit throws on an empty/invalid DOB; `document.body.style.overflow` is a web-only DOM side-effect inside the component.                                                | `src/app/profile/edit.tsx` (33–35, 93–100)                          |
| 4   | Edge cases     | Notifications `NotificationPage` dereferences `data.notifications` **before** its null check and renders a raw `error.message`; no skeleton or mark-read affordance in the page.                                | `src/components/Notifcation/NotificationPage.tsx` (15–19)           |
| 5   | Implementation | Settings' notification toggles are **commented out** — no way to change push/email or the runway autoplay policy (both now in scope).                                                                           | `src/app/settings.tsx` (124–154)                                    |
| 6   | Implementation | `editUserDetails`/`deleteAccount` branch validation/feedback across `Alert`/`showToast`/`Toast` per platform; `deleteAccount` uses `user.data.id` (throws for guests); both double-toast.                       | `editUserDetails.ts`, `deleteAccount.ts`                            |
| 7   | Data           | Notifications logging: `console.log("User Notifications:", result)` and `console.log({data})`; empty `catch {}` in `getUserNotifications`.                                                                      | `getUserNotifications.ts` (20, 23); `NotificationPage.tsx` (18, 25) |
| 8   | Implementation | Profile uses a web-only `<div>` + inline `boxShadow` for the floating message button (divergent native/web code paths).                                                                                         | `src/components/profile/Profile.tsx` (293–304)                      |
| 9   | Visual         | Monochrome violations: `royalBlue` accents, hard-coded `#B3261E`/`#F0CFCD` danger colors, `shadow-sm`/`shadow-lg`.                                                                                              | `Profile.tsx`, `settings.tsx`                                       |

**Proposed fix**

- Merge the tab and `/profile/[profile]` into one `ProfileScreen` (no dummy FlatList) with a
  single `useProfile` query (React Query) and `useColumnCount`.
- Wire the wishlist to `getProductLikes` via a query (not global store); keep the empty state.
- Guard the DOB → ISO conversion (invalid date → inline error, never throw); remove the web
  DOM side-effect in favor of a modal/portal pattern.
- Fix notifications: null-safe data access, skeleton + error/retry + empty states, mark-read
  on tap; standardize to one toast module.
- Restore the Settings toggles (email/push + the runway autoplay data-saver control).
- Monochrome restyle and token colors for danger/status (always paired with icon+label).

**Backend impact:** none required (`/currentUser`, `/adminUpdateUser`, `/changePassword`,
`/deleteUserAccount`, `/addUserAddress`, `/updateUserAddress`, `/deleteUserAddress`,
`/getUserAddresses`, `/getUserOrders`, `/getStoreOrders` (custom), `/getProductLikes`,
`/my-code`, `/get-user-coupons`, `/custom-notification/get`, `/custom-notification/read`).

**Risk & effort:** Medium effort, medium risk (account data + destructive delete).

**Changes user-facing behavior:** Yes — wishlist actually loads, notifications render safely
with mark-read, settings toggles work.

**Backend recommendations:** return profile + addresses + orders + wishlist + notifications
counts in one `/currentUser` payload (or a `/profile/me` aggregate) to cut the current fan-out.

### F10. Vendor management

**Rating: Poor** — the vendor flows are the largest, least-maintainable part of the app
(31–45 KB form components), with token logging and navigation mixed into networking.

**Screens:** `/store/create`, `/store/create/freebie`, `/store/add/[item]`,
`/store/add/freebie`, `/store/edit/details/index`, `/store/orders/custom`,
`/product/edit/[product]`.

**Problems found**

| #   | Area            | Problem                                                                                                                                                                                                | Evidence                                                                    |
| --- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1   | Implementation  | **Giant form components**: `AddProduct` (45 KB), `AddMakeupPackage` (34 KB), `EditProduct` (31 KB), `AddFreebie` (18 KB) — form state in Zustand with long manual validation chains.                   | `src/components/store/**`, `src/components/product_details/EditProduct.tsx` |
| 2   | Data & security | `updateOrderStatus` logs the **auth token**; `addProducts` logs request/response payloads.                                                                                                             | `updateOrderStatus.ts` (11); `addProducts.ts` (130)                         |
| 3   | Implementation  | Navigation side-effects inside networking (`router.replace` after adding a product); `getUserStore().myStore.id` throws when the vendor has no store.                                                  | `addProducts.ts` (86–87, 159)                                               |
| 4   | Implementation  | `createStore` hard-codes `category_id: 3`, `product_category_id: 1` (magic IDs) and logs the result; the main CTA's `disabled` prop is **commented out** so "Create Store"/"Next" is always pressable. | `createStore.ts` (32–33); `store/create.tsx` (254–269)                      |
| 5   | Implementation  | `store/create.tsx` imports Expo Router internals (`expo-router/build/global-state/router-store`) and mixes three toast/notification systems.                                                           | `store/create.tsx` (20, 24–27)                                              |
| 6   | UX              | Double feedback everywhere: `Alert.alert` + `showToast` on success, `Toast.error` + `showToast` on error; no single toast module.                                                                      | `addProducts.ts` (148–158); `updateOrderStatus.ts` (28–36)                  |
| 7   | Edge cases      | `store/orders/custom.tsx` reads `user.usertype.store_id` with no null guard and no loading/error/empty state; `getCustomOrders` sends no auth header and skips `ok` checks.                            | `store/orders/custom.tsx` (19); `getCustomOrders.ts`                        |
| 8   | Implementation  | `addProducts` sends contradictory keys (`naija` + `made_in_nigeria`) and hard-codes `fabrics: null, drawings: null`; prices/units sent as strings in some paths.                                       | `addProducts.ts` (104–125)                                                  |
| 9   | UX              | Vendor bank/withdraw flows (`Balance`, `VendorBalance`, `BankDetails`) are separate large components with the same manual-validation pattern.                                                          | `src/components/store/`                                                     |

**Proposed fix**

- Rebuild the vendor forms on `react-hook-form` + `zod` (available in the new stack), one form
  per product type, with inline errors and a shared media-upload + category/subcategory picker.
- Move all vendor mutations to React Query; keep navigation in screens (never in networking);
  remove all token/PII logging; drop the internal Expo Router import.
- Replace magic category IDs with fetched category data; remove `Alert`+`showToast` double-ups.
- Guard `user.usertype.store_id`; add loading/error/empty/offline states to orders and balance.
- Fix the always-enabled "Create Store" CTA with real validation state.

**Backend impact:** none required (`/createStore`, `/editStore`, `/vendor/v2/products`,
`/addRunwayProduct`, `/createBoomerang`, `/deleteBoomerang`, `/deleteProduct`,
`/updateProducts`, `/updateProductAttributes`, `/getStoreOrders`, `/updateOrder`,
`/addBank`, `/getMyBanks`, `/editBank`, `/deleteBank`, `/getPaystackBanks`,
`/resolveAccountDetails`, `/userBalance`, `/pendWithdraw`, `/paystack/transfer`, `/uploadFile`).

**Risk & effort:** High effort (largest surface), medium risk (vendor data + payouts).

**Changes user-facing behavior:** Yes — consistent validation/feedback, reliable form submission,
real order-list states.

**Backend recommendations:** return the vendor's store (or `store_id`) in `/currentUser` so the
client doesn't have to call `getUserStore()` inside every mutation; add payout/balance aggregates
to `/userBalance` to reduce the cashout screen's fan-out.

### F11. Help, support & legal/static

**Rating: Needs improvement** — functional, but FAQ content is factually wrong about payments,
the forum is a placeholder, and legal pages are raw HTML styled outside the token system.

**Screens:** `/help`, `/faqs`, `/forum`, `/privacy`, `/terms`, `/cookies`, `/refund`, `/return`.

**Problems found**

| #   | Area           | Problem                                                                                                                                                                                                                                                   | Evidence                                                        |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 1   | UX / Data      | **FAQ answers are generic and factually wrong** for this product: they claim "credit cards, PayPal, and bank transfers" and a "5% commission" — contradicting the actual Paystack (card/bank transfer/USSD) rail and real fees. Misleading trust content. | `src/app/(helpTabs)/faqs.tsx` (16–66)                           |
| 2   | Implementation | Legal pages render **raw HTML elements** (`<div>`, `<h1>`, `<ul>`, `<address>`) with hard-coded fonts/colors — effectively web-only and outside the monochrome/token system.                                                                              | `src/app/privacy.tsx` (and `terms`/`cookies`/`refund`/`return`) |
| 3   | UX             | Forum is a static placeholder (hard-coded thread, "3 days ago", "Emma") with no real data.                                                                                                                                                                | `src/app/(helpTabs)/forum.tsx`                                  |
| 4   | Visual         | `bg-royalBlue` chips, hard-coded web `paddingTop: 100`, `console.log({page})`.                                                                                                                                                                            | `help.tsx`, `faqs.tsx`                                          |

**Proposed fix**

- Rewrite FAQ content to match the actual product (Paystack methods, real commission/refund
  policy, order tracking) — plain, accurate, Nigeria-specific; keep buyer/vendor tabs.
- Convert legal pages to shared `LegalDocument` components using system fonts + token colors
  (works on native and web); keep the real policy text.
- Either implement the forum against a real data source or mark it "coming soon" with an
  empty state (no fabricated threads).

**Backend impact:** none required (static content).

**Risk & effort:** Low effort, low risk.

**Changes user-facing behavior:** Yes — accurate FAQ/policy content.

### F12. Fashion news

**Rating: Needs improvement** — pagination + de-dupe are decent, but styling is off-brand and
the `as any`/gradient patterns recur.

**Screens:** `/fashion-news`, `/fashion-news/[id]`.

**Problems found**

| #   | Area           | Problem                                                                                                                     | Evidence                                    |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | Visual         | `expo-linear-gradient` overlays, `bg-kikaeYellow` badges, `shadow-md`, hard-coded `#f3f4f3` background, `#0000ff` spinners. | `fashion-news.tsx`, `fashion-news/[id].tsx` |
| 2   | Implementation | `router.push({…} as any)` type assertion; no error/retry state (only loading + empty).                                      | `fashion-news.tsx` (24)                     |
| 3   | Data           | `getFashionNews`/`getFashionNewsById` skip `response.ok` checks (otherwise typed cleanly).                                  | `src/networking/getFashionNews.ts`          |

**Proposed fix**

- Reuse the `ArticleCard`/`NewsCard` from the shared component set; replace gradient scrim with
  a solid tone step, token colors, and a proper `Href` type (drop `as any`); add error/retry.

**Backend impact:** none required (`/customer/v2/browse/fashion-news`, `…/{id}`).

**Risk & effort:** Low effort, low risk.

**Changes user-facing behavior:** Yes — token-consistent styling + error states.

### F13. Custom orders (bespoke tailoring)

**Rating: Poor** — the flow spans product → cart → checkout → order lists, but the status
model is broken (string mismatches), role gating is path-based, and approval feedback is weak.

**Screens:** `/profile/custom_orders/index` (customer), `/store/orders/custom` (vendor);
entry via `CustomSizeModal` on `/product/[product]`.

**Old flow (mapped step by step)**

1. Customer opens a product and taps "Custom size" → `CustomSizeModal` collects measurements
   (length, shoulder, chest, sleeve, biceps, armors, neck + description) into `customOrderSlice`.
2. "Add to cart" → `addToCart(…, isCustom: true)` → `POST /addToCart`.
3. Cart → checkout → `initiatePayment` (products carry the measurements) → Paystack →
   `payments/verify/{reference}` (orders created server-side, status `order_placed`, idempotent).
4. Customer list: `/profile/custom_orders/index` → `getUserCustomOrders` → `POST /getStoreOrders {user_id, custom:true}`.
5. Vendor list: `/store/orders/custom` → `getCustomOrders` → `POST /getStoreOrders {store_id, custom:true}`.
6. Vendor accept/reject: `ApproveCustomModal` → `approveOrRejectCustomOrder` → `POST /approveCustom {id, approvedCustom}`.
7. Vendor advance: `EditCustomOrderStatus` → `updateOrderStatus` → `POST /updateOrder {id, status}`.

**Status lifecycle (from code: `orderTypes.ts`, `orderStatus.ts`)**

| Current state             | Next state(s)                                                | Triggered by                                                |
| ------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| (paid)                    | `order_placed`                                               | Customer (payment success → `/payments/verify/{reference}`) |
| `order_placed`            | `approvedCustom: true` / `approvedCustom: false` (no refund) | Vendor (`/approveCustom`)                                   |
| approved                  | `ready_for_delivery`                                         | Vendor (`/updateOrder`)                                     |
| `ready_for_delivery`      | `dispatched`                                                 | Admin (`/updateOrder`)                                      |
| `dispatched`              | `delivered`                                                  | Admin (`/updateOrder`)                                      |
| `delivered`               | `settled`                                                    | Console `order:settlement` (hourly)                         |
| service: `service_booked` | `service_pending`                                            | Vendor (`/updateOrder`)                                     |
| `service_pending`         | `settled`                                                    | Customer (`/updateOrder`)                                   |

**Problems found**

| #   | Area            | Problem                                                                                                                                                                                                                                            | Evidence                                                          |
| --- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | UX              | **Status string mismatch**: `CustomOrders` compares `order.status.toLocaleLowerCase()` (yields `order_placed`) against `"order placed"` (space) and `"confirmed"` (a status that doesn't exist), so the "Ready for delivery" action never renders. | `src/components/store/CustomOrders.tsx` (117–145)                 |
| 2   | Data            | `OrderItem.status` union duplicates `settled` and omits `confirmed`; `approvedCustom` is a bare boolean with no timestamp/audit.                                                                                                                   | `src/types/orderTypes.ts` (108–110)                               |
| 3   | Implementation  | Role gating uses `usePathname()` (`path == "/store/orders/custom"`), which breaks on deep links and web; approval is optimistic local state only (no refetch/rollback).                                                                            | `CustomOrders.tsx` (32, 115, 149, 159)                            |
| 4   | Data & security | `/approveCustom` and `/getStoreOrders` (custom) send no auth header; `getUserCustomOrders` calls `user.data.id` (throws for guests); `console.log(data)`.                                                                                          | `approveOrRejectCustomOrder.ts`; `getUserCustomOrders.ts` (6, 21) |
| 5   | UX              | Measurements are free-text numeric fields with `maxLength={10}` but no unit/range guidance (cm vs in); `placeholderTextColor={"#000"}` makes placeholder look like filled text.                                                                    | `CustomSizeModal.tsx` (172–233)                                   |
| 6   | UX              | No ₦ formatting on `order.price`; a stray `{"price"}` literal renders; no fallback image when `product.media[0]` is missing.                                                                                                                       | `CustomOrders.tsx` (83–105)                                       |
| 7   | Edge cases      | No loading/error/offline state in either custom-orders screen; `user.usertype.store_id` dereferenced without a null guard.                                                                                                                         | `store/orders/custom.tsx` (19); `profile/custom_orders/index.tsx` |

**Proposed fix**

- Keep the **current lifecycle exactly as it exists** (no new stages now); model it as a single
  enum and render the status stepper from it (only valid "next" actions per role) so stages can
  be added later without a redesign — never string comparisons.
- Replace path-based gating with `isStoreOwner`/user-role props already available from the store hooks.
- Drive approve/reject + status advance through React Query mutations with optimistic updates +
  refetch/rollback and a single toast; add auth headers to all custom-order calls.
- Convert measurements to a typed schema with unit labels + validation; show a ₦-formatted price
  and a placeholder fallback; add loading/error/empty states.

**Backend impact:** needs backend work — status is **free-text** (not an enum; DB default
`"Order placed"`); `approveCustom` only sets `approvedCustom` and does **not** refund on decline.
`/updateOrder` is `auth:sanctum`; `/approveCustom`/`/getStoreOrders` are unauthenticated. See
`docs/backend-findings.md` (Orders & payments).

**Risk & effort:** Medium effort, medium risk.

**Changes user-facing behavior:** Yes — the vendor's "Ready for delivery" action actually
renders; status is shown as a lifecycle; approval feedback is consistent.

**Backend recommendations:** return `approvedCustom` + allowed next-status per order from
`/getStoreOrders`; enforce the status transition + reject→refund server-side.

**Backlog:** post-rebuild items (customer cancellation, dispute path, an "in production" stage,
delivery deadline, customer receipt confirmation before `settled`, real-time messaging over
WebSockets, and who triggers `settled`/vendor payouts) live in `docs/design/backlog.md`.

### F14. Vendor ↔ customer messaging (deleted)

**Rating: Poor / not shipped** — a messaging feature existed but was **deleted** in commit
`a838edb`; it was never finished (stub list screen, 5 s polling, swapped params). Recovered from
git history for this audit.

**Screens (deleted):** `/messages` (list), `/store/messages/[id]` (thread).
**Endpoints (deleted from frontend only; still present server-side):** `POST /getMessages
{sender_id, recepient_id}`, `POST /createMessage {sender_id, recepient_id, body}`, plus
`/getUserMessages`, `/updateMessage`, `/deleteMessage`, and `/sse/messages` (SSE).

**Recovered implementation (mapped)**

1. Entry: storefront chat-bubble (`UserStoreNav.goToMessage`) originally → `/store/messages/[id]`
   (later repointed to `/store/orders/custom`).
2. `/messages` — placeholder only ("Messages from vendor will appear here"); no conversation list.
3. `/store/messages/[id]` — renders the raw `{id}` as the header, then `TextConvo` + `TextBox`.
4. `TextConvo` — polls `getMessages` every 5 s (`setInterval`), compares the last id, renders
   bubbles (`bg-red-500` vendor / `bg-royalBlue` user), "sending"/"sent" on the last message.
5. `TextBox` — optimistic append + `sendMessage`; placeholder "Type here to translate!"; no
   disable-on-empty, no send-fail/retry.
6. `messageSlice` — Zustand (messages + loading/sending/deleting/updating/creating).

**Problems found**

| #   | Area           | Problem                                                                                                                | Evidence                                    |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | Implementation | Conversation list was a placeholder — no list, no unread counts, no last-message preview.                              | `src/app/messages.tsx` (deleted)            |
| 2   | Implementation | Thread header renders the raw `{id}` string, not the counterparty name.                                                | `src/app/store/messages/[id].tsx` (deleted) |
| 3   | Implementation | `getMessages` **swaps** `sender_id`/`recepient_id`; no `response.ok` check; logs payloads.                             | `getMessages.ts` (deleted)                  |
| 4   | UX             | **Not real-time**: 5 s `setInterval` polling, no push/WebSocket; no ordering guarantee; no pagination.                 | `TextConvo.tsx` (deleted)                   |
| 5   | UX             | No send/fail/retry state; empty message can be sent; placeholder is a copy-paste artifact ("Type here to translate!"). | `TextBox.tsx` (deleted)                     |
| 6   | UX             | No attachments, no order linking, no read receipts, no unread counts.                                                  | (absent from recovered code)                |
| 7   | Visual         | `bg-red-500` vs `bg-royalBlue` bubbles, `#0000ff` spinner — off-brand/colored.                                         | `TextConvo.tsx` (deleted)                   |
| 8   | Data           | `sendMessage` has an empty `catch`; no auth guard on read/send.                                                        | `sendMessage.ts` (deleted)                  |

**Proposed fix (redesign: restore + reimplement over HTTP only)**

- Treat `POST /getMessages {sender_id, recepient_id}` and `POST /createMessage
{sender_id, recepient_id, body}` as the **known contract**; fix the swapped params.
- **No polling, no WebSockets.** Fetch on: thread open, screen focus, app foreground return, after
  send, and pull-to-refresh. Show a manual refresh affordance + a "last updated" cue — messages
  will not appear automatically.
- Build behind a small interface — `useMessages(threadId)` backed by a `MessagesTransport` — so a
  WebSocket transport can replace HTTP later without changing screens.
- **Optimistic send** with per-message `sending → sent → failed (retry)` states; disable empty
  send; offline queue with retry; order by `created_at` + id; paginate the thread.
- **Deferred UI (needs confirmation):** design the conversation list, unread counts, read receipts,
  attachments and order-linking UI so they appear once the backend supports them — do **not**
  invent endpoints now.
- Monochrome restyle (gray surface bubbles, black/white emphasis).

**Backend impact:** **confirmed** — `/getMessages` and `/createMessage` still exist server-side
(only the frontend screens were removed); use HTTP + SSE. Anything beyond that (conversation list,
unread, read receipts, attachments, order links) requires new/changed endpoints.

**Risk & effort:** High effort (restored backend surface), medium risk. Build in normal dependency
order (after auth, API client and custom orders).

**Changes user-facing behavior:** Yes — restores vendor ↔ customer messaging (manual refresh model).

**Backend recommendations:** restore `/getMessages` + `/createMessage` (fix swapped params);
conversation list, unread counts, read receipts, attachments and order linking are "needs
confirmation" — raise separately.

---

## Security notes

- **Auth token storage:** native stores the token in `expo-secure-store` (iOS Keychain / Android
  Keystore) — secure. Web currently stores it in a `universal-cookie` **JS-readable, non-HttpOnly,
  non-Secure** cookie — recommend moving to **server-set `HttpOnly`, `Secure`, `SameSite` cookies**
  (or short-lived tokens + refresh). **No `AsyncStorage` usage** was found (good).
- **Hard-coded Bearer token** in `src/networking/getProductDetail.ts` (commented, but committed)
  must be **revoked and rotated** — it remains in git history.
- Cross-cutting: `console.log` of tokens (`addToCart`, `updateOrderStatus`), full orders
  (`storeTransaction`), payment payloads (`initiatePayment`), and PII (`register`) must be removed.

## Questions

> **All six questions are answered in `docs/backend-findings.md` (Answers to open questions).**

- Messaging endpoints (`/getMessages`, `/createMessage`) and screens were deleted — confirm they
  should be restored (F14) and, if so, the real-time channel (WebSocket vs push).
- Confirm the custom-order status enum + allowed transitions and who may trigger each (F13).
- Confirm `/social-login/google` returns a token + user in one round-trip (F1b).
- Confirm `/getReviews` returns the canonical review list (not ratings) and that unlike via
  `like:false`/`DELETE` is supported (F4).
- Confirm `/getStoreLikes` accepts an arbitrary viewed `store_id` (F7).
- The `forum` screen has no data source — implement or mark "coming soon" (F11).

## Consolidated backend recommendations (prioritized)

1. **Payments (P0):** create orders + re-check amounts server-side; return order id + `tx_ref`
   from `/payments/initiate` (or a server-side order-create step); keep `/payments/verify/{reference}`
   idempotent (already is); provide a verification-complete webhook/redirect (F8).
2. **Custom-order authorization (P0):** enforce server-side authorization on `/approveCustom` and
   `/getStoreOrders` (custom) — the old client sends no auth header; `/updateOrder` is already
   `auth:sanctum` (F13).
3. **Messaging (P0):** restore `/getMessages` + `/createMessage` (fix swapped params);
   conversation list, unread counts, read receipts, attachments and order linking are
   needs-confirmation (F14, HTTP-only for now).
4. **Custom orders (P1):** return `approvedCustom` + allowed next-status per order; enforce
   status transitions + reject→refund server-side (F13).
5. **Auth (P1):** standardize error shapes; return token + user from `/social-login/google` (F1b).
6. **Web auth (P1):** server-set `HttpOnly`, `Secure`, `SameSite` cookies (or short-lived tokens
   - refresh) instead of the current JS-readable cookie.
7. **Product engagement (P1):** add unlike/`DELETE` (or accept `like:false`); return the canonical
   review list from `/getReviews` (F4).
8. **Stores (P2):** return `store_likes`/`followers`/`is_following` on `/store/get/{id}` (F7).
9. **Profile (P2):** aggregate profile/addresses/orders/wishlist/notification counts into
   `/currentUser` (or `/profile/me`) (F9).
10. **Vendor (P2):** return the vendor's `store_id` in `/currentUser`; add payout aggregates to
    `/userBalance` (F10).
11. **Home/Discover (P2):** add `beauty`/`hair`/`made_in_nigeria` to `customer/v2/home`; return a
    discovery-specific payload (F2/F3b); single typed `{products, stores}` from `/searchProducts` (F3b).
12. **Makeup (P3):** a dedicated makeup-services endpoint (packages + coverage/availability) (F6).
