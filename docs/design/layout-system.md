# Kikae — Layout System

Responsive grid, margins, content width, and navigation for iOS / Android / Web. Works with the
tokens in `tokens.md` (spacing scale, radii) and the principles in `design-principles.md`
(Density, Performance). Mobile-first.

## 1. Breakpoints

| Name   | Min width | Typical device                  |
| ------ | --------- | ------------------------------- |
| `base` | 0         | phones                          |
| `sm`   | 640       | large phones, small tablets     |
| `md`   | 768       | tablets, tablet landscape       |
| `lg`   | 1024      | small desktop, tablet landscape |
| `xl`   | 1280      | desktop                         |
| `2xl`  | 1536      | large desktop                   |

## 2. Grid, margins & content width

Columns are **container-based**, not viewport-based, with a **breakpoint-based gap**:

```
gap = width ≥ 1024 ? 24 : 16
columns = clamp(minColumns, floor((containerWidth + gap) / (minCardWidth + gap)), maxColumns)
```

with `minCardWidth = 160`, `minColumns = 2`, `maxColumns = 5`. One shared
`useColumnCount(containerWidth)` implements this — never hand-rolled per screen (see audit F2/F3a).

| Breakpoint   | Content area    | Columns (computed) | Gutter/gap | Page margin | Max content width (content area, excludes sidebar) | Nav     |
| ------------ | --------------- | ------------------ | ---------- | ----------- | -------------------------------------------------- | ------- |
| `base` (0)   | full width      | 2                  | 16         | 16          | —                                                  | tab bar |
| `sm` (640)   | full width      | 3                  | 16         | 24          | —                                                  | tab bar |
| `md` (768)   | full width      | 4                  | 16         | 24          | —                                                  | tab bar |
| `lg` (1024)  | width − sidebar | 4                  | 24         | 32          | 1200                                               | sidebar |
| `xl` (1280)  | width − sidebar | 5                  | 24         | 32          | 1280                                               | sidebar |
| `2xl` (1536) | width − sidebar | 5                  | 24         | 40          | 1440                                               | sidebar |

- **Sidebar width:** 256. **Top bar height:** 56 (mobile) / 64 (desktop). **Tab bar height:** 56 +
  safe-area inset.
- Max content width applies to the **content area only** (i.e., after subtracting the sidebar on
  desktop); reading content centers at **720**, forms at **480**.
- All margins/gutters use the `tokens.md` spacing scale.

## 3. Navigation (one rule by width, all platforms)

- **Below 1024:** bottom **tab bar** — Home, Discover, Runway, Makeup, Profile (Makeup stays a tab;
  Cart is **not** a tab). ≥ 44px targets, sits above the safe-area inset.
- **1024 and up (web desktop AND native tablets):** left **sidebar** with the same five entries;
  content scrolls independently.
- **Top bar (all widths):** phone = **logo, Search, Cart (with badge), Notifications (badge)** —
  account lives under Profile. Desktop adds the account entry. **No Messages icon** (added only once
  a conversation list exists). Cart is a top-bar icon with a badge, never a tab.
- **Guest (signed out):** the five tabs and **search itself are browsable without sign-in**; tapping
  Cart, Notifications, or a protected action (wishlist, follow, comment, checkout) prompts sign-in;
  Profile shows "Sign in".
- **Vendor navigation** (store owners): a vendor section reachable from Profile — **Store, Orders,
  Custom orders, Payouts** (bank/withdraw). On desktop it becomes a vendor sidebar group; on phone
  it is the store's tab strip (products / makeup / runway / orders / banks).
- **Auth & simple forms:** centered card (max **480**, `lg` radius, 1px `line`) on the `canvas` —
  no tab bar/sidebar.

## 4. Page templates

Every screen spec must use one of these templates:

1. **Feed / grid** — Home, Discover rails, category lists, wishlist, stores: uniform grid (fixed
   4:5 cards) or horizontal rails.
2. **Masonry feed** — Pinterest-style image discovery where card heights vary; see Masonry below.
3. **Product detail** — single column on phone; **split** (gallery left, info + actions right) at
   ≥ 1024.
4. **Cart / checkout** — single column on phone; **two-column with a sticky order summary** at
   ≥ 1024.
5. **Centered form** — auth, address, review, store-create: single centered card (480/560).
6. **Two-pane list/detail** — messaging (conversation list + thread) and orders (list + detail) at
   ≥ 1024.
7. **Vendor dashboard** — cards on phone; a **table** at ≥ 1024.
8. **Reading** — legal and fashion-news at **720** max.
9. **Immersive media** — Runway full-bleed video (tap-to-play, data-saver).
10. **List / settings** — Profile, settings, and help rows (a single-column list of `ListItem`s).

## 5. Masonry rules

- Masonry applies to **image-led discovery** (Discover) where card heights vary; **uniform grids**
  apply to catalogs/products with the fixed 4:5 card ratio.
- Use **stable aspect ratios** (4:5, 16:9, 1:1, 9:16 from `tokens.md`) so a loading image never
  causes layout shift.
- **Low-end Android:** virtualize the masonry (masonry-capable list with stable keys), avoid
  re-measuring on scroll, and keep the two-column default on phones.

## 6. Chrome rules

- **Hide the tab bar/sidebar** on: product detail, cart/checkout, message thread, and immersive
  Runway (full-bleed video).
- **Sticky bottom bars** (Add to Cart, checkout CTA) respect safe-area insets and use keyboard
  avoidance so they sit above the keyboard.
- **Sheets** (bottom sheets) become **centered dialogs** at ≥ 1024.

## 7. Image sizing & skeletons

| Columns | Card width (approx) | Request width (at most 2×) |
| ------- | ------------------- | -------------------------- |
| 2       | 160–180             | 360                        |
| 3       | 220–240             | 480                        |
| 4       | 260–300             | 600                        |
| 5       | 240–280             | 560                        |

- Request **at most 2×** the rendered width (never ~3×, to save data); never a full-size original.
- **Needs backend confirmation → resolved: no server-side resizing.** Apply width params only if the
  external file server (`FILE_SERVER_URL` / `EXPO_PUBLIC_MEDIA_URL_PREFIX`) supports them; otherwise
  request the original URL.
- **Skeletons must match the final layout** (same aspect ratio and size as the real card) so
  content does not shift when images load.

## 8. Insets, keyboard, type scaling & RTL

- **Edge-to-edge (Android):** draw behind the system bars; apply `useSafeAreaInsets` for top,
  bottom, and horizontal cutouts. Never hard-code a status-bar height.
- **Keyboard:** forms use `KeyboardAvoidingView` + scroll-to-focused; sticky CTAs rise above the
  keyboard.
- **Font scaling:** layouts hold to **200%** (see `tokens.md` Type scale). On **fixed-height
  elements** (tab labels, buttons, badges, table cells) cap `maxFontSizeMultiplier` (e.g., 1.3) so
  they don't overflow — never below 200% for body/reading text.
- **RTL:** use logical properties; mirror **directional icons** (back/forward chevrons, send
  arrow) via `transform: scaleX(-1)` or an icon-direction prop.
- **Foldables / landscape / tablets:** always use the **current window/container width** to pick
  columns and nav — no special-casing.

## 9. Density (phone vs desktop)

- **Phone:** compact spacing (16 margins, 16 gaps), 2-col grid, touch-first.
- **Desktop:** comfortable spacing (32–40 margins, 24–32 gaps), 4–5-col grid, larger headings.
- Density is achieved by choosing larger spacing-token steps, never smaller fonts.
