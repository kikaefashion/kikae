# Kikae Frontend — Application Inventory

> Auto-generated inventory of every screen (route), navigation flow, and API endpoint in this codebase.
> Legend: **`api`** = `EXPO_PUBLIC_API_URL` · **`auth`** = `EXPO_PUBLIC_AUTH_URL` (see base URLs below).

## 1. Overview

| Attribute        | Value                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Project          | `kikaefrontend` (Kikae)                                                                      |
| Runtime          | Expo SDK 55 (React Native 0.83, React 19) — iOS / Android / Web                              |
| Router           | `expo-router` (file-based routing, `src/app/**`) with `typedRoutes` + React Compiler enabled |
| State management | Zustand (`src/store/store.ts`) + TanStack React Query (server cache)                         |
| HTTP client      | Native `fetch` (no axios) — wrappers in `src/networking/**`                                  |
| Styling          | NativeWind / Tailwind CSS                                                                    |
| Entry            | `expo-router/entry` → `src/app/_layout.tsx` (native) / `_layout.web.tsx` (web)               |

### Base URLs & environment

Defined in `src/networking/apiUrl.ts`, `domain.ts`, `links.ts` and `.env.*`.

| Env var                           | Dev value                                            | Prod value                                              | Exported as                        |
| --------------------------------- | ---------------------------------------------------- | ------------------------------------------------------- | ---------------------------------- |
| `EXPO_PUBLIC_API_URL`             | `https://dev.kikae.com.ng/api`                       | `https://server.kikae.com.ng/api`                       | `apiUrl` (`api`)                   |
| `EXPO_PUBLIC_AUTH_URL`            | `https://dev.kikae.com.ng`                           | `https://server.kikae.com.ng`                           | `authUrl` (`auth`)                 |
| `EXPO_PUBLIC_MEDIA_URL_PREFIX`    | `https://file-dev.kikae.com.ng/`                     | `https://files.kikae.com.ng/`                           | `mediaUrlPrefix`                   |
| `EXPO_PUBLIC_CALLBACK_URL`        | `http://localhost:8081/checkout/verification`        | `https://www.kikae.com.ng/checkout/verification`        | `callback_url`                     |
| `EXPO_PUBLIC_MAKEUP_CALLBACK_URL` | `http://localhost:8081/checkout/makeup/verification` | `https://www.kikae.com.ng/checkout/makeup/verification` | `makeup_callback_url`              |
| `EXPO_PUBLIC_PAYSTACK_KEY`        | `pk_test_…`                                          | `pk_live_…`                                             | `apiKey`                           |
| `EXPO_PUBLIC_DOMAIN`              | `http://localhost:8081/`                             | `https://kikae.com.ng/`                                 | `domain`                           |
| `EXPO_PUBLIC_APP_URL`             | `https://frontend-dev.kikae.com.ng`                  | `https://www.kikae.com.ng`                              | `baseUrl` (app links)              |
| `EXPO_PUBLIC_WEBSOCKET`           | `socket-dev.kikae.com.ng`                            | `socket.kikae.com.ng`                                   | (defined, not referenced in `src`) |

## 2. Screens (Routes)

All routes live under `src/app`. `()` groups are layout-only; `[x]` are dynamic segments.
**Duplicate / Redundant** flags platform variants (`.web`), stale/unused, or duplicate implementations.

### Auth & onboarding

| Route             | Source file                  | Purpose                                  | Duplicate / Redundant |
| ----------------- | ---------------------------- | ---------------------------------------- | --------------------- |
| `/onboarding`     | `src/app/onboarding.tsx`     | Onboarding intro carousel                | —                     |
| `/login`          | `src/app/login.tsx`          | Login (email/password + Google)          | —                     |
| `/register`       | `src/app/register.tsx`       | Sign-up form (starts email verification) | —                     |
| `/verify_email`   | `src/app/verify_email.tsx`   | Email verification code entry            | —                     |
| `/reset_password` | `src/app/reset_password.tsx` | Forgot/reset password (3-step wizard)    | —                     |

### Main tab bar (route group `(tabs)`)

| Route            | Source file                      | Purpose                       | Duplicate / Redundant     |
| ---------------- | -------------------------------- | ----------------------------- | ------------------------- |
| `/`              | `src/app/(tabs)/index.tsx`       | Home feed                     | —                         |
| `/discover`      | `src/app/(tabs)/discover.tsx`    | Discover / explore categories | —                         |
| `/runway`        | `src/app/(tabs)/runway.tsx`      | Runway (short-video) feed     | —                         |
| `/makeup`        | `src/app/(tabs)/makeup.tsx`      | Makeup services               | —                         |
| `/profile`       | `src/app/(tabs)/profile.tsx`     | Own profile                   | —                         |
| `(tabs)/_layout` | `src/app/(tabs)/_layout.tsx`     | Bottom tab bar (native)       | platform variant          |
| `(tabs)/_layout` | `src/app/(tabs)/_layout.web.tsx` | Stack + Navbar (web)          | platform variant of above |

### Product, catalog & storefront

| Route                           | Source file                                | Purpose                                | Duplicate / Redundant |
| ------------------------------- | ------------------------------------------ | -------------------------------------- | --------------------- |
| `/product/[product]`            | `src/app/product/[product].tsx`            | Product detail (increments views)      | —                     |
| `/product/comments/[productId]` | `src/app/product/comments/[productId].tsx` | Product comments (threaded)            | —                     |
| `/product/reviews/[productId]`  | `src/app/product/reviews/[productId].tsx`  | Product reviews                        | —                     |
| `/product/edit/[product]`       | `src/app/product/edit/[product].tsx`       | Edit a product (vendor)                | —                     |
| `/review/[id]`                  | `src/app/review/[id].tsx`                  | Write a product review                 | —                     |
| `/categories`                   | `src/app/categories.tsx`                   | Browse categories (+section shortcuts) | —                     |
| `/categories/products/[id]`     | `src/app/categories/products/[id].tsx`     | Products of a subcategory/type         | —                     |
| `/catalog`                      | `src/app/catalog.tsx`                      | Search results (products + stores)     | —                     |
| `/image-search`                 | `src/app/image-search.tsx`                 | Visual/image search results            | —                     |
| `/stores`                       | `src/app/stores.tsx`                       | Stores directory                       | —                     |
| `/store/[store]`                | `src/app/store/[store].tsx`                | Public storefront                      | —                     |
| `/store/runway_videos/[id]`     | `src/app/store/runway_videos/[id].tsx`     | Store runway videos                    | —                     |

### Cart & checkout

| Route                                      | Source file                                           | Purpose                            | Duplicate / Redundant |
| ------------------------------------------ | ----------------------------------------------------- | ---------------------------------- | --------------------- |
| `/cart`                                    | `src/app/cart.tsx`                                    | Shopping cart                      | —                     |
| `/checkout/address/create`                 | `src/app/checkout/address/create.tsx`                 | Create shipping address (checkout) | —                     |
| `/checkout/confirmation`                   | `src/app/checkout/confirmation.tsx`                   | Order confirmation                 | —                     |
| `/checkout/confirmation/makeup/[makeupId]` | `src/app/checkout/confirmation/makeup/[makeupId].tsx` | Makeup order confirmation          | —                     |
| `/checkout/makeup/verification`            | `src/app/checkout/makeup/verification.tsx`            | Makeup payment verification        | —                     |
| `/checkout/payment`                        | `src/app/checkout/payment.tsx`                        | Paystack payment WebView           | —                     |
| `/checkout/verification`                   | `src/app/checkout/verification.tsx`                   | Payment success screen             | —                     |

### Profile sub-screens

| Route                                    | Source file                                         | Purpose                                   | Duplicate / Redundant |
| ---------------------------------------- | --------------------------------------------------- | ----------------------------------------- | --------------------- |
| `/profile/[profile]`                     | `src/app/profile/[profile].tsx`                     | Profile view (own, w/ nav)                | —                     |
| `/profile/edit`                          | `src/app/profile/edit.tsx`                          | Edit profile / change password (modal)    | —                     |
| `/profile/modal`                         | `src/app/profile/modal.tsx`                         | Demo modal screen                         | stale/unused          |
| `/profile/address/add`                   | `src/app/profile/address/add.tsx`                   | Add address (modal)                       | —                     |
| `/profile/address/edit/[addressId]`      | `src/app/profile/address/edit/[addressId].tsx`      | Edit address (modal)                      | —                     |
| `/profile/custom_orders/index`           | `src/app/profile/custom_orders/index.tsx`           | Customer custom orders                    | —                     |
| `/profile/order_details/[order]`         | `src/app/profile/order_details/[order].tsx`         | Order details                             | —                     |
| `/profile/promotion_details/[promotion]` | `src/app/profile/promotion_details/[promotion].tsx` | Promotion detail                          | —                     |
| `/wishlists`                             | `src/app/wishlists.tsx`                             | Wishlist                                  | —                     |
| `/customer/coupons`                      | `src/app/customer/coupons.tsx`                      | Coupons / referral code                   | —                     |
| `/notifications`                         | `src/app/notifications.tsx`                         | Notifications                             | —                     |
| `/settings`                              | `src/app/settings.tsx`                              | Settings (legal, support, delete account) | —                     |

### Store / vendor management

| Route                       | Source file                            | Purpose                                            | Duplicate / Redundant |
| --------------------------- | -------------------------------------- | -------------------------------------------------- | --------------------- |
| `/store/create`             | `src/app/store/create.tsx`             | Create vendor store (2-step)                       | —                     |
| `/store/create/freebie`     | `src/app/store/create/freebie.tsx`     | Create freebie store                               | —                     |
| `/store/add/[item]`         | `src/app/store/add/[item].tsx`         | Add product / runway video / makeup package / bank | —                     |
| `/store/add/freebie`        | `src/app/store/add/freebie.tsx`        | Add freebie                                        | —                     |
| `/store/edit/details/index` | `src/app/store/edit/details/index.tsx` | Edit store details                                 | —                     |
| `/store/orders/custom`      | `src/app/store/orders/custom.tsx`      | Vendor custom orders                               | —                     |

### Help & support (route group `(helpTabs)`)

| Route                | Source file                      | Purpose                           | Duplicate / Redundant |
| -------------------- | -------------------------------- | --------------------------------- | --------------------- |
| `/help`              | `src/app/(helpTabs)/help.tsx`    | Help (General / Order / Payments) | —                     |
| `/faqs`              | `src/app/(helpTabs)/faqs.tsx`    | FAQs (buyer/vendor)               | —                     |
| `/forum`             | `src/app/(helpTabs)/forum.tsx`   | Forum (static placeholder)        | —                     |
| `(helpTabs)/_layout` | `src/app/(helpTabs)/_layout.tsx` | Help tab bar                      | —                     |

### Legal / static pages

| Route      | Source file           | Purpose            | Duplicate / Redundant |
| ---------- | --------------------- | ------------------ | --------------------- |
| `/privacy` | `src/app/privacy.tsx` | Privacy policy     | —                     |
| `/terms`   | `src/app/terms.tsx`   | Terms & conditions | —                     |
| `/cookies` | `src/app/cookies.tsx` | Cookie policy      | —                     |
| `/refund`  | `src/app/refund.tsx`  | Refund policy      | —                     |
| `/return`  | `src/app/return.tsx`  | Return policy      | —                     |

### Content

| Route                | Source file                     | Purpose              | Duplicate / Redundant |
| -------------------- | ------------------------------- | -------------------- | --------------------- |
| `/fashion-news`      | `src/app/fashion-news.tsx`      | Fashion news listing | —                     |
| `/fashion-news/[id]` | `src/app/fashion-news/[id].tsx` | Fashion news article | —                     |

> ⚠️ `src/components/MobileLayout.tsx` declares `<Stack.Screen>` names for routes that do **not** exist as files (stale/dead references): `store/edit/event/[event]`, `store/premium_subscription/[premium]`, `messages`.

## 3. Navigation flows

### 3.1 Root layout (provider + shell)

- **Native** — `src/app/_layout.tsx`: wraps the app in `SafeAreaProvider` → `QueryClientProvider` → `ToastProvider`, renders global `ToastComponent`, `GlobalNotification`, `SuccessPopupComponent`, then `<MobileLayout/>`.
- **Web** — `src/app/_layout.web.tsx`: same providers plus `GoogleOAuthProvider`; renders `<WebLayout/>` with a **sidebar** (`Home`, `Discover`, `Runway`, `Makeup`, `Profile`) and, on small screens, a bottom nav. Hides the sidebar on auth screens (`login`, `register`, `reset_password`, `verify_email`).

### 3.2 Native shell (`src/components/MobileLayout.tsx`)

Bootstraps fonts/splash, hydrates the user + wishlist via `getUser()` / `getProductLikes()`, registers push notifications, then declares a `<Stack>` of all top-level routes (auth, product, cart, checkout, store, profile, help, etc.).

- Modal presentation (`presentation: "transparentModal"`, `animation: "fade"`): `profile/edit`, `profile/address/add`, `profile/address/edit/[addressId]` (and web equivalents for `profile/edit`, `profile/address/*`, `profile/order_details/*`, `store/edit/details`).
- ⚠️ Declares stale routes (no matching file): `store/edit/event/[event]`, `store/premium_subscription/[premium]`, `messages`.

### 3.3 Main tabs (`src/app/(tabs)/_layout.tsx`)

- Native bottom tab bar with 5 tabs: **Home** (`index`), **Discover**, **Runway**, **Makeup**, **Profile**.
- Onboarding guard: if `SecureStore` has no `isUserOnboarded`, `<Redirect href="/onboarding"/>`.
- Hides the top `Navbar` on `/runway` and `/profile`.

### 3.4 Help tabs (`src/app/(helpTabs)/_layout.tsx`)

- Tabs **Help**, **FAQs**, **Forum** (native) — or a custom sidebar/bottom bar on web; falls back to `Navbar` + `<Stack/>`.

### 3.5 Auth & guest flows

- Login success → `router.replace("/")`; unverified email → `router.push("/verify_email")`.
- `login` ↔ `register` (Sign-up instead / login links); `login` → `reset_password`.
- Register (in `src/app/register.tsx`) sends verification code then `router.push("/verify_email")`.
- Reset password (`src/app/reset_password.tsx`) is a 3-step internal wizard (email → OTP → new password) via `ResetPassword` / `OtpPassword` / `NewPassword`.

### 3.6 Core user journeys

- Home/categories → `/categories` (or `/categories?section=nigeria|thrift|beauty|hair|freebies`) → `/categories/products/[id]` → `/product/[product]`.
- Product detail → `/product/comments/[productId]`, `/product/reviews/[productId]`, `/review/[id]` (write review), `/product/edit/[product]` (vendor).
- Search → `/catalog?query=…`; visual search → `/image-search`.
- Storefront: `/stores` → `/store/[store]` → `/store/runway_videos/[id]`.
- Cart → `/cart` → `/checkout/address/create` → `/checkout/confirmation` → `/checkout/payment` (Paystack WebView) → `/checkout/verification`.
- Makeup: `/checkout/confirmation/makeup/[makeupId]` → `/checkout/makeup/verification`.
- Vendor: `/store/create` (or `/store/create/freebie`) → add items via `/store/add/[item]` (product / runway_video / makeup_package / bank) and `/store/add/freebie` → manage orders `/store/orders/custom`, edit store `/store/edit/details/index`.
- Profile: `/profile` → `/profile/edit`, `/profile/address/*`, `/profile/custom_orders/index`, `/profile/order_details/[order]`, `/wishlists`, `/customer/coupons`, `/notifications`, `/settings`.

### 3.7 Deep links / share links (`src/networking/links.ts`)

- `productAppLink(id)` → `{APP_URL}/product/{id}`
- `storeAppLink(id)` → `{APP_URL}/store/{id}`
- `runwayAppLink(storeId, videoId?)` → `{APP_URL}/store/runway_videos/{storeId}?video={videoId}`
- `openLinks(url)` → `Linking.openURL`

### 3.8 App-link configuration (`app.json`)

- Scheme: `kikae`; router origin `https://www.kikae.com.ng`.
- Android intent-filters / iOS `associatedDomains` for hosts `www.kikae.com.ng` & `frontend-dev.kikae.com.ng`, path prefixes: `/product`, `/store/runway_videos`, `/cart`, `/checkout`.

## 4. API endpoints

All calls are `fetch()` wrappers in `src/networking/**`. Bases: `api` = `${apiUrl}`, `auth` = `${authUrl}`.
**Request body** shows the JSON keys (or `FormData`). `—` = no body.
**Duplicate / Redundant** flags platform variants, shared endpoints, or duplicate implementations.

### 4.1 Auth

| Method | Endpoint                     | Base | Request body                                                                              | Source file(s)                                 | Duplicate / Redundant               |
| ------ | ---------------------------- | ---- | ----------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------- |
| POST   | `/login`                     | auth | `{ email, password }`                                                                     | `login.ts`, `login.web.ts`                     | platform variant                    |
| POST   | `/register`                  | auth | `{ email, lname, password, password_confirmation, fname, phone, address, referrer_code }` | `register.ts`                                  | —                                   |
| POST   | `/social-login/google`       | api  | `{ access_token }`                                                                        | `socialLogin.ts`, `socialLogin/socialLogin.ts` | duplicate (same call, two files)    |
| POST   | `/send-verification-code`    | api  | `{ email }`                                                                               | `sendVerificationCode.ts`                      | —                                   |
| POST   | `/confirm-verification-code` | api  | `{ code }`                                                                                | `verifyVerificationCode.ts`                    | —                                   |
| POST   | `/sendCode`                  | api  | `{ email }`                                                                               | `forgotPassword/sendCode.ts`                   | —                                   |
| POST   | `/verifyCode`                | api  | `{ code }`                                                                                | `forgotPassword/verifyCode.ts`                 | —                                   |
| POST   | `/updatePassword`            | api  | `{ id, password, confirmed }`                                                             | `forgotPassword/updatePassword.ts`             | —                                   |
| POST   | `/updatePassword`            | api  | `{ user_id, password, confirmed, id }`                                                    | `updatePassword.ts`                            | duplicate endpoint (different body) |

### 4.2 Products, discovery & content

| Method | Endpoint                                                                                                    | Base | Request body                                                                      | Source file(s)                                            | Duplicate / Redundant                          |
| ------ | ----------------------------------------------------------------------------------------------------------- | ---- | --------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| GET    | `/customer/v2/home?…` (new_arrivals/sponsored/thrift/featured/trending/fashion_news/freebies/runway limits) | api  | `—`                                                                               | `getCustomerHomeV2.ts`                                    | —                                              |
| POST   | `/getProducts`                                                                                              | api  | `{ thrift }`                                                                      | `getProducts.ts` (`getThriftProducts`)                    | shared endpoint                                |
| POST   | `/getProducts`                                                                                              | api  | `{ category_id }`                                                                 | `getCategoryProducts.tsx`                                 | shared endpoint                                |
| POST   | `/getProducts`                                                                                              | api  | `{ freebies }`                                                                    | `getFreebies.tsx`                                         | shared endpoint                                |
| POST   | `/getProducts`                                                                                              | api  | `{ made_in_nigeria }`                                                             | `getMadeInNigeria.tsx`                                    | shared endpoint                                |
| POST   | `/filterProducts`                                                                                           | api  | `{ category_id, product_category_id, color, size, rating, price_min, price_max }` | `filterProducts.ts`                                       | shared endpoint                                |
| POST   | `/filterProducts`                                                                                           | api  | `{ category_id }`                                                                 | `filter/filterCategoryProducts.ts`, `getProducts.ts` (×3) | duplicate (same body)                          |
| POST   | `/filterProducts`                                                                                           | api  | `{ product_category_id }`                                                         | `filter/getGenderCategoriesProducts.ts`                   | shared endpoint                                |
| POST   | `/searchProducts`                                                                                           | api  | `{ name }`                                                                        | `filter/search.ts`                                        | shared endpoint                                |
| POST   | `/searchProducts`                                                                                           | api  | `{ popular }`                                                                     | `filter/getMostPopular.ts`                                | shared endpoint                                |
| POST   | `/searchProducts`                                                                                           | api  | `{ newest }`                                                                      | `filter/getNewest.ts`                                     | shared endpoint                                |
| GET    | `/getGalleryProducts`                                                                                       | api  | `—`                                                                               | `filter/getGalleryProducts.ts`                            | —                                              |
| GET    | `/getGalleryProducts?highest_price=true`                                                                    | api  | `—`                                                                               | `filter/sortHightestPrice.ts`                             | —                                              |
| GET    | `/getGalleryProducts?lowest_price=true`                                                                     | api  | `—`                                                                               | `filter/sortLowestPrice.ts`                               | —                                              |
| GET    | `/customer/v2/products/filter?product_type_id={id}`                                                         | api  | `—`                                                                               | `filter/filterProductsByProductType.ts`                   | —                                              |
| GET    | `/getProduct/{product_id}`                                                                                  | api  | `—`                                                                               | `getProductDetail.ts`                                     | —                                              |
| POST   | `/products/{productId}/view`                                                                                | api  | `—` (body commented out)                                                          | `increamentProductViews.ts`                               | —                                              |
| GET    | `/products/{productId}/views`                                                                               | api  | `—` (body commented out)                                                          | `getProductViews.ts`                                      | —                                              |
| POST   | `/products/image-search`                                                                                    | api  | `FormData` (`image`)                                                              | `imageSearch.ts`                                          | —                                              |
| POST   | `/products/ai/analyze`                                                                                      | api  | `{ imageUrl }`                                                                    | `store/addItemsToStore/productsAiAnalyze.ts`              | —                                              |
| POST   | `/getProductComments`                                                                                       | api  | `{ product_id }`                                                                  | `getProductComments.ts`                                   | —                                              |
| POST   | `/getReviews`                                                                                               | api  | `{ product_id }`                                                                  | `getProductReviews.ts`                                    | —                                              |
| POST   | `/createReview`                                                                                             | api  | `{ user_id, product_id, comment, rating }`                                        | `createReview.ts`                                         | —                                              |
| POST   | `/getProductLikes`                                                                                          | api  | `{ user_id }`                                                                     | `getProductLikes.ts`                                      | —                                              |
| POST   | `/likeProduct`                                                                                              | api  | `{ product_id, like, user_id }`                                                   | `likeProduct.ts`                                          | —                                              |
| POST   | `/saveProductComment`                                                                                       | api  | `{ product_id, user_id, comment, parent_id }`                                     | `saveProductComment.ts`                                   | —                                              |
| POST   | `/deleteProductComment`                                                                                     | api  | `{ id }`                                                                          | `deleteProductComment.ts`                                 | —                                              |
| POST   | `/reportProduct`                                                                                            | api  | `{ user_id, message, product_id }`                                                | `reportProduct.ts`                                        | —                                              |
| GET    | `/banners/all`                                                                                              | api  | `—`                                                                               | `getBanners.ts`                                           | —                                              |
| GET    | `/api/v2/categories`                                                                                        | api  | `—`                                                                               | `getCategories.ts`                                        | ⚠️ double `/api` (base already ends in `/api`) |
| GET    | `/getProductCategories`                                                                                     | api  | `—`                                                                               | `getProductCategories.ts`                                 | —                                              |
| GET    | `/v2/categories/{productCategoryId}/subcategories`                                                          | api  | `—`                                                                               | `getSubcategories.ts`                                     | —                                              |
| GET    | `/v2/subcategories/{productSubcategoryId}/product-types`                                                    | api  | `—`                                                                               | `getProductTypes.ts`                                      | —                                              |
| GET    | `/customer/discovery/categories`                                                                            | api  | `—`                                                                               | `getDiscovery.ts`                                         | —                                              |
| GET    | `/customer/discovery/categories/{categoryId}/subcategories`                                                 | api  | `—`                                                                               | `getDiscovery.ts`                                         | —                                              |
| GET    | `/customer/discovery/subcategories/{subcategoryId}/product-types`                                           | api  | `—`                                                                               | `getDiscovery.ts`                                         | —                                              |
| GET    | `/customer/discovery/products{query}`                                                                       | api  | `—`                                                                               | `getDiscovery.ts`                                         | —                                              |
| GET    | `/customer/v2/browse/fashion-news?page={page}`                                                              | api  | `—`                                                                               | `getFashionNews.ts`                                       | —                                              |
| GET    | `/customer/v2/browse/fashion-news/{id}`                                                                     | api  | `—`                                                                               | `getFashionNewsById.ts`                                   | —                                              |

### 4.3 Cart

| Method | Endpoint          | Base | Request body                                                                                                              | Source file(s)           | Duplicate / Redundant |
| ------ | ----------------- | ---- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------ | --------------------- |
| POST   | `/addToCart`      | api  | `{ units, product_id, size_id, color_id, length, shoulder, neck, biceps, armors, sleeve, chests, description, isCustom }` | `cart/addToCart.ts`      | —                     |
| POST   | `/getCart`        | api  | `{ user_id }`                                                                                                             | `cart/getCart.ts`        | —                     |
| POST   | `/updateCart`     | api  | `{ user_id, product_id }`                                                                                                 | `cart/updateCart.ts`     | —                     |
| POST   | `/removeFromCart` | api  | `{ id }`                                                                                                                  | `cart/removeCartItem.ts` | —                     |
| POST   | `/deleteCart`     | api  | `{ user_id }`                                                                                                             | `deleteCart.tsx`         | —                     |

### 4.4 Orders & payments

| Method | Endpoint                       | Base | Request body                                                                                                               | Source file(s)             | Duplicate / Redundant |
| ------ | ------------------------------ | ---- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------- |
| POST   | `/payments/initiate`           | api  | `{ cart_ids, delivery_address, area, coupon_code, area_id, phone_number, availability, products, city, state, is_studio }` | `order/initiatePayment.ts` | —                     |
| GET    | `/payments/verify/{reference}` | api  | `—`                                                                                                                        | `order/verifyPayment.ts`   | —                     |
| POST   | `/storeTransaction`            | api  | `{ user_id, transaction_id, amount, address, tx_ref, status, delivery_address }`                                           | `storeTransaction.ts`      | —                     |
| POST   | `/storeTransaction`            | api  | `{ user_id, transaction_id, amount, address, tx_ref, status, delivery_address, orders }`                                   | `storeTransaction.web.ts`  | platform variant      |
| POST   | `/getUserOrders`               | api  | `{ user_id }`                                                                                                              | `getUserOrders.ts`         | shared endpoint       |
| POST   | `/getUserOrders`               | api  | `{ id }`                                                                                                                   | `getSingleOrder.ts`        | shared endpoint       |
| POST   | `/getPayment`                  | api  | `{ products, coupon_code }`                                                                                                | `getFullPayment.ts`        | —                     |
| POST   | `/returns`                     | api  | `{ reason, order_id, refund_method }`                                                                                      | `returnOrder.ts`           | —                     |

### 4.5 Stores (public storefront)

| Method | Endpoint                        | Base | Request body                   | Source file(s)                  | Duplicate / Redundant |
| ------ | ------------------------------- | ---- | ------------------------------ | ------------------------------- | --------------------- |
| GET    | `/getStores`                    | api  | `—`                            | `getStores.ts`                  | —                     |
| GET    | `/store/get/{store_id}`         | api  | `—`                            | `store/getSingleStore.ts`       | —                     |
| GET    | `/store/get/self`               | api  | `—`                            | `store/getUserStore.ts`         | —                     |
| POST   | `/incrementStoreVisits`         | api  | `{ store_id }`                 | `store/incrementStoreVisits.ts` | —                     |
| POST   | `/storeFollower`                | api  | `{ id, user_id, store_id }`    | `store/followStore.ts`          | —                     |
| POST   | `/deleteFollowing`              | api  | `{ user_id, store_id }`        | `store/unfollowStore.ts`        | —                     |
| POST   | `/getFollowers`                 | api  | `{ id, user_id, store_id }`    | `store/getStoreFollowers.tsx`   | —                     |
| POST   | `/getFollowing`                 | api  | `—` (resolves user internally) | `getUserFollowings.ts`          | —                     |
| POST   | `/getStoreLikes`                | api  | `{ store_id }`                 | `store/getStoreLikes.ts`        | —                     |
| GET    | `/getStoreProducts/{store_id}`  | api  | `—`                            | `store/getStoreProducts.ts`     | —                     |
| GET    | `/getStoreBoomerangs/{storeID}` | api  | `—`                            | `store/getStoreRunwayVideos.ts` | —                     |

### 4.6 Runway

| Method | Endpoint               | Base | Request body                                 | Source file(s)         | Duplicate / Redundant |
| ------ | ---------------------- | ---- | -------------------------------------------- | ---------------------- | --------------------- |
| POST   | `/getBoomerangs`       | api  | `—`                                          | `getRunwayVideos.ts`   | —                     |
| POST   | `/getRunwayComments`   | api  | `{ runwayId }`                               | `getRunwayComments.ts` | —                     |
| POST   | `/storeRunwayComments` | api  | `{ runway_id, comment, user_id, parent_id }` | `runwayComment.ts`     | —                     |
| POST   | `/runway/like/toggle`  | api  | `{ user_id, runway_id }`                     | `runwayLike.ts`        | —                     |
| POST   | `/runway/likes`        | api  | `{ user_id, runway_id }`                     | `runwayLike.ts`        | —                     |

### 4.7 Store / vendor management

| Method | Endpoint                   | Base | Request body                                                                                                                                                                   | Source file(s)                               | Duplicate / Redundant              |
| ------ | -------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ---------------------------------- |
| POST   | `/createStore`             | api  | `{ name, email, address, phone, description, primary_media, website, user_id, category_id, product_category_id, state_id, isFreebie, area, logo }`                             | `createStore.ts`                             | —                                  |
| POST   | `/editStore`               | api  | `{ store_id, name, email, phone, address, description, user_id, category_id, product_category_id, state_id, volume }`                                                          | `store/editStore.ts`                         | —                                  |
| POST   | `/vendor/v2/products`      | api  | `{ description, product_category_id, product_subcategory_id, product_type_id, old_price, price, units, store_id, sizes, media, offer, thrift, fabrics, drawings }`             | `store/addItemsToStore/addProducts.ts`       | shared endpoint                    |
| POST   | `/vendor/v2/products`      | api  | `{ description, product_category_id, product_subcategory_id, product_type_id, isMakeup, price, store_id, media, offer, fabrics, drawings, units, coverages, made_in_nigeria }` | `store/addItemsToStore/addMakeupPackage.ts`  | shared endpoint                    |
| POST   | `/vendor/v2/products`      | api  | `{ description, product_category_id, product_subcategory_id, product_type_id, price, units, store_id, media, fabrics, drawings }`                                              | `store/addItemsToStore/addFreebie.ts`        | shared endpoint                    |
| POST   | `/addRunwayProduct`        | api  | `{ runway_id, product_id }`                                                                                                                                                    | `store/addItemsToStore/addRunwayProducts.ts` | —                                  |
| POST   | `/createBoomerang`         | api  | `{ id, store_id, url, title, description }`                                                                                                                                    | `store/addItemsToStore/addRunwayVideo.ts`    | —                                  |
| POST   | `/deleteBoomerang`         | api  | `{ id }`                                                                                                                                                                       | `store/deleteRunwayVideo.ts`                 | —                                  |
| POST   | `/deleteProduct`           | api  | `{ id }`                                                                                                                                                                       | `store/deleteProduct.ts`                     | —                                  |
| POST   | `/updateProducts`          | api  | `{ units, price, id, sizes, colours, offer, description }`                                                                                                                     | `editProduct.ts`                             | —                                  |
| POST   | `/updateProductAttributes` | api  | `payload` (create/edit/delete attribute object)                                                                                                                                | `editProductAttributes.ts`                   | —                                  |
| POST   | `/addAvailabilty`          | api  | `{ store_id, product_id, dated }`                                                                                                                                              | `store/addAvailability.ts`                   | —                                  |
| POST   | `/addCoverageArea`         | api  | `—` (empty `{}`)                                                                                                                                                               | `store/addCoverageArea.ts`                   | —                                  |
| POST   | `/getAvailability`         | api  | `{ product_id }`                                                                                                                                                               | `getAvailability.ts`                         | —                                  |
| POST   | `/approveCustom`           | api  | `{ id, approvedCustom }`                                                                                                                                                       | `store/approveOrRejectCustomOrder.ts`        | —                                  |
| POST   | `/getStoreOrders`          | api  | `{ store_id }`                                                                                                                                                                 | `store/getStoreOrders.ts`                    | shared endpoint                    |
| POST   | `/getStoreOrders`          | api  | `{ store_id, year }`                                                                                                                                                           | `store/getStoreYearlyOrders.ts`              | shared endpoint                    |
| POST   | `/getStoreOrders`          | api  | `{ store_id, custom }`                                                                                                                                                         | `store/getCustomOrders.ts`                   | shared endpoint                    |
| POST   | `/getStoreOrders`          | api  | `{ user_id, custom }`                                                                                                                                                          | `getUserCustomOrders.ts`                     | duplicate (same endpoint, 4 files) |
| POST   | `/updateOrder`             | api  | `{ id, status }`                                                                                                                                                               | `store/updateOrderStatus.ts`                 | —                                  |
| GET    | `/getTransactions/{id}`    | api  | `—`                                                                                                                                                                            | `store/getStoreTransactions.ts`              | —                                  |
| GET    | `/getPlans`                | api  | `—`                                                                                                                                                                            | `store/getPlans.tsx`                         | —                                  |
| POST   | `/getStoreEvents`          | api  | `{ store_id }`                                                                                                                                                                 | `store/getStoreEvents.ts`                    | —                                  |
| POST   | `/userBalance`             | api  | `{ user_id }`                                                                                                                                                                  | `store/getVendorBalance.ts`                  | —                                  |
| POST   | `/logistics-metrics`       | api  | `{ store_id }`                                                                                                                                                                 | `store/getLogisticsMetrics.ts`               | —                                  |
| POST   | `/pendWithdraw`            | api  | `{ user_id, payout_method, bank, account_number, account_name, bank_code }`                                                                                                    | `store/requestCashout.ts`                    | —                                  |
| POST   | `/paystack/transfer`       | api  | `{ name, account_number, bank_code, user_id }`                                                                                                                                 | `store/withdraw.ts`                          | —                                  |
| POST   | `/addBank`                 | api  | `{ account_number, account_name, bank_code, store_id }`                                                                                                                        | `addBank.ts`                                 | —                                  |
| POST   | `/getMyBanks`              | api  | `{ store_id }`                                                                                                                                                                 | `getUserBanks.ts`                            | duplicate (same endpoint)          |
| POST   | `/getMyBanks`              | api  | `{ id }`                                                                                                                                                                       | `store/getMyBanks.ts`                        | duplicate (same endpoint)          |
| POST   | `/editBank`                | api  | `{ account_number, account_name, bank_code, store_id, id }`                                                                                                                    | `store/editBankDetails.ts`                   | —                                  |
| POST   | `/deleteBank`              | api  | `{ id }`                                                                                                                                                                       | `deleteBank.ts`                              | —                                  |
| GET    | `/getPaystackBanks`        | api  | `—`                                                                                                                                                                            | `getBanks.ts`                                | —                                  |
| POST   | `/resolveAccountDetails`   | api  | `{ bank_code, account_number }`                                                                                                                                                | `resolveAccountDetails.ts`                   | —                                  |
| POST   | `/extendFreeby`            | api  | `{ duration }`                                                                                                                                                                 | `extendFreebie.ts`                           | —                                  |

### 4.8 Profile / account

| Method | Endpoint             | Base | Request body                                                                     | Source file(s)                                 | Duplicate / Redundant          |
| ------ | -------------------- | ---- | -------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------ |
| POST   | `/currentUser`       | api  | `—` (auth via header)                                                            | `getUser/getUser.ts`, `getUser/getUser.web.ts` | platform variant               |
| POST   | `/adminUpdateUser`   | api  | `{ id, fname, lname, phone, email, gender, dob }`                                | `editUserDetails.ts`                           | shared endpoint                |
| POST   | `/adminUpdateUser`   | api  | `{ id, profilePic, fname, lname, phone }`                                        | `editProfilePic.ts`                            | shared endpoint                |
| POST   | `/changePassword`    | api  | `{ id, current_password, new_password, new_password_confirmation }`              | `changePassword.ts`                            | —                              |
| POST   | `/deleteUserAccount` | api  | `{ user_id }`                                                                    | `deleteAccount.ts`                             | —                              |
| POST   | `/addUserAddress`    | api  | `{ user_id, address, state_id, fname, lname, phone, city, info, isDefault }`     | `addNewAddress.ts`                             | —                              |
| POST   | `/updateUserAddress` | api  | `{ id, user_id, address, state_id, fname, lname, phone, city, info, isDefault }` | `editAddress.ts`                               | duplicate (same endpoint/body) |
| POST   | `/updateUserAddress` | api  | `{ id, user_id, address, state_id, fname, lname, phone, city, info, isDefault }` | `makeDefaultAddress.ts`                        | duplicate (same endpoint/body) |
| POST   | `/deleteUserAddress` | api  | `{ id }`                                                                         | `deleteAdress.ts`                              | —                              |
| POST   | `/getUserAddresses`  | api  | `{ user_id }`                                                                    | `getUserAddress.tsx`                           | —                              |

### 4.9 Notifications

| Method | Endpoint                    | Base | Request body                                | Source file(s)                                | Duplicate / Redundant |
| ------ | --------------------------- | ---- | ------------------------------------------- | --------------------------------------------- | --------------------- |
| GET    | `/custom-notification/get`  | api  | `—`                                         | `notifications/getUserNotifications.ts`       | —                     |
| POST   | `/custom-notification/read` | api  | `{ id }`                                    | `notifications/markUserNotificationAsRead.ts` | —                     |
| POST   | `/device-token`             | api  | `{ device_token, user_id, platform, role }` | `notifications/saveUserToken.ts`              | —                     |
| POST   | `/get-users-token`          | api  | `{ user_id: [user_id] }`                    | `notifications/getUserToken.ts`               | —                     |

### 4.10 Coupons

| Method | Endpoint            | Base | Request body | Source file(s)               | Duplicate / Redundant |
| ------ | ------------------- | ---- | ------------ | ---------------------------- | --------------------- |
| GET    | `/my-code`          | api  | `—`          | `coupons/getReferallCode.ts` | —                     |
| GET    | `/get-user-coupons` | api  | `—`          | `coupons/getUserCoupons.ts`  | —                     |
| POST   | `/add-user-coupon`  | api  | `{ code }`   | `coupons/addCoupon.tsx`      | —                     |

### 4.11 Logistics, states & app meta

| Method | Endpoint                   | Base | Request body         | Source file(s)               | Duplicate / Redundant |
| ------ | -------------------------- | ---- | -------------------- | ---------------------------- | --------------------- |
| GET    | `/getLogistics`            | api  | `—`                  | `getLogistics.ts`            | —                     |
| POST   | `/getLogisticDestination`  | api  | `{ logistic_id }`    | `getLogisticDestinations.ts` | —                     |
| GET    | `/uniqueLogisticState`     | api  | `—`                  | `getKikaeStates.ts`          | —                     |
| POST   | `/uniqueLogisticStateArea` | api  | `{ state_id }`       | `getKikaeAreas.ts`           | —                     |
| POST   | `/stateAreaLogistic`       | api  | `{ state_id, area }` | `getKikaeLogistics.ts`       | —                     |
| GET    | `/getStates`               | api  | `—`                  | `getStates.ts`               | —                     |
| GET    | `/get_details`             | api  | `—`                  | `getLatestAppVersion.ts`     | —                     |
| GET    | `/maintanance-status`      | api  | `—`                  | `getMaintenanceStatus.ts`    | —                     |

### 4.12 Uploads

| Method | Endpoint      | Base | Request body      | Source file(s)  | Duplicate / Redundant |
| ------ | ------------- | ---- | ----------------- | --------------- | --------------------- |
| POST   | `/uploadFile` | api  | `FormData` (file) | `uploadFile.ts` | —                     |

## 5. Duplicate / redundant files index

### Platform variants (`.web.tsx` / `.web.ts` — intentional per-platform builds)

| Native                                                               | Web variant                                                  | Notes                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| `src/app/_layout.tsx`                                                | `src/app/_layout.web.tsx`                                    | Root shell                            |
| `src/app/(tabs)/_layout.tsx`                                         | `src/app/(tabs)/_layout.web.tsx`                             | Tabs shell                            |
| `src/networking/login.ts`                                            | `src/networking/login.web.ts`                                | `POST /login`                         |
| `src/networking/getUser/getUser.ts`                                  | `src/networking/getUser/getUser.web.ts`                      | `POST /currentUser`                   |
| `src/networking/storeTransaction.ts`                                 | `src/networking/storeTransaction.web.ts`                     | `POST /storeTransaction`              |
| `src/functions/authToken.ts`                                         | `src/functions/authToken.web.ts`                             | token storage (SecureStore vs cookie) |
| `src/utils/notification.ts`                                          | `src/utils/notification.web.ts`                              | push notifications                    |
| `src/components/runway/RunwayFeed.tsx`                               | `src/components/runway/RunwayFeed.web.tsx`                   | —                                     |
| `src/components/runway/VideoPost.tsx`                                | `src/components/runway/VideoPost.web.tsx`                    | —                                     |
| `src/components/navbar/Navbar.tsx`                                   | `src/components/navbar/Navbar.web.tsx`                       | —                                     |
| `src/components/Menu/Menu.tsx`                                       | `src/components/Menu/Menu.web.tsx`                           | —                                     |
| `src/components/GoogleSignin.tsx`                                    | `src/components/GoogleSignink.web.tsx`                       | note filename typo (`Signink`)        |
| `src/components/phoneInput/PhoneInput.tsx`                           | `src/components/phoneInput/PhoneInput.web.tsx`               | —                                     |
| `src/components/store/StorePlans.tsx`                                | `src/components/store/StorePlans.web.tsx`                    | —                                     |
| `src/components/store/RunwayVideo/StoreRunwayVideos.tsx`             | `src/components/store/RunwayVideo/StoreRunwayVideos.web.tsx` | —                                     |
| `src/components/Order/OrderConfirmation.tsx`                         | `src/components/Order/OrderConfirmation.web.tsx`             | —                                     |
| `src/components/Order/MakeupOrderConfirmation.tsx`                   | `src/components/Order/MakeupOrderConfirmation.web.tsx`       | —                                     |
| `src/components/ViewImage/ViewImage.tsx`                             | `src/components/ViewImage/ViewImage.web.tsx`                 | —                                     |
| `src/components/DatePicker/*.tsx`                                    | `src/components/DatePicker/*.web.tsx` (+ Mobile/Web split)   | —                                     |
| `src/components/Gallery/GalleryComponent.tsx`, `FullscreenModal.tsx` | `*.web.tsx`                                                  | —                                     |

### True duplicates / redundant implementations (networking)

| Files                                                                                                                                    | Endpoint                    | Why redundant                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------- |
| `socialLogin.ts` **and** `socialLogin/socialLogin.ts`                                                                                    | `POST /social-login/google` | Identical call, two files                             |
| `updatePassword.ts` **and** `forgotPassword/updatePassword.ts`                                                                           | `POST /updatePassword`      | Same endpoint, different body shape                   |
| `getUserBanks.ts` **and** `store/getMyBanks.ts`                                                                                          | `POST /getMyBanks`          | Same endpoint                                         |
| `getUserCustomOrders.ts`, `store/getCustomOrders.ts`, `store/getStoreOrders.ts`, `store/getStoreYearlyOrders.ts`                         | `POST /getStoreOrders`      | Same endpoint, 4 files with slightly different bodies |
| `filterProducts.ts`, `filter/filterCategoryProducts.ts`, `filter/getGenderCategoriesProducts.ts`, plus 3 helpers inside `getProducts.ts` | `POST /filterProducts`      | Same endpoint, several wrappers                       |
| `filter/search.ts`, `filter/getMostPopular.ts`, `filter/getNewest.ts`                                                                    | `POST /searchProducts`      | Same endpoint, different filter key                   |
| `store/addItemsToStore/addProducts.ts`, `addMakeupPackage.ts`, `addFreebie.ts`                                                           | `POST /vendor/v2/products`  | Same endpoint, different bodies                       |
| `editAddress.ts` **and** `makeDefaultAddress.ts`                                                                                         | `POST /updateUserAddress`   | Same endpoint + same body                             |

### True duplicates / redundant components

| Files                                                                                    | Why redundant                                                                                                                                                          |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/Navbar.tsx` **and** `src/components/navbar/Navbar.tsx`                   | Two Navbar components with the same name                                                                                                                               |
| `src/components/ToastComponent.tsx`, `src/components/CustomToast/*`, `src/utils/toast/*` | Multiple toast helpers; `package.json` also lists `react-toastify`, `expo-react-native-toastify`, `react-native-toast-message`, `toastify-react-native` (4 toast libs) |

### Stale / unused

- `src/app/profile/modal.tsx` — demo modal, not used in flows.
- `src/components/MobileLayout.tsx` `<Stack.Screen>` entries with no matching route file: `store/edit/event/[event]`, `store/premium_subscription/[premium]`, `messages`.

## 6. Notes & caveats

- No axios; all requests are raw `fetch` with `Authorization: Bearer <token>` where authenticated.
- Auth token is stored in `expo-secure-store` (native) / `universal-cookie` (web) via `src/functions/authToken.ts` / `.web.ts`.
- `getCategories.ts` calls `${apiUrl}/api/v2/categories` — since `apiUrl` already ends in `/api`, this produces a double `/api` path (likely a bug).
- `getProductViews.ts` / `increamentProductViews.ts` have their `body` commented out (view tracking relies on the URL path param only).
- Payment is handled by Paystack via `order/initiatePayment.ts` (returns `authorization_url`) rendered in a `WebView` on `/checkout/payment`, then verified by `order/verifyPayment.ts`.
- `EXPO_PUBLIC_WEBSOCKET` is defined in `.env.*` but is not referenced anywhere in `src` (no WebSocket client found).
