# Kikae — Components

Shared component inventory. Every component uses the tokens in `tokens.md` (no one-off colors,
spacing, or radii), respects the state set, and follows the accessibility rules at the end. Screen
specs reference these components by name. If a spec later uses a component missing here, add it (see
the note at the end).

## 1. Foundations (inputs & actions)

### Button

- **Variants:** `primary` (black bg / white text; inverted in dark), `secondary` (outline,
  `line-strong`, `surface` bg), `text` (no bg, `fg`), `danger` (outline/text with the
  `error` accent **+ icon + label** — never a solid red fill; used for destructive actions).
- **Sizes:** `sm` (height 40, `callout`), `md` (height 48, default), `lg` (height 56, full-width
  primary CTAs like "Add to Cart" / "Checkout"). Shape: always `full` (pill).
- **States:** default · pressed (scale 0.96 / opacity 0.7) · focused (two-tone ring) · disabled
  (`primary-disabled` bg, never opacity-only) · loading (small spinner + label, keeps width).
- **A11y:** `role="button"`, accessible label, `disabled`/`busy` announced; loading announces "loading".

### IconButton

- 44×44 hit target, 24 icon; pressed scale, focus ring. **A11y:** `accessibilityLabel` describes the
  action, `accessibilityRole="button"`.

### Input (TextField)

- **Static label above the field** (always visible). Rest border = `line` (1px); **focus** border =
  `line-strong` (1px) + two-tone ring; **error** border = `error` (1px) + message. Boxed variant
  uses `md` radius + `surface` bg. Helper/error text below (`fg-muted` / `error`). Placeholder =
  `fg-placeholder`.
- **States:** default · focused · error · disabled (`fg-disabled`, gray surface).
- **A11y:** label associated (`htmlFor`/`accessibilityLabel`), `textContentType`/`autoComplete` set,
  error announced via live region.

### PhoneInput

- Input variant with `+234` (NG default) country code and forgiving normalization (leading `0`
  accepted, spaces/dashes stripped). Validates on blur; error state like Input.

### OtpInput

- Six single-digit cells (Input styles); auto-advance, numeric keyboard. **Code length is 6
  (confirmed).** Supports SMS autofill (`textContentType="oneTimeCode"`),
  paste of the full code, and a **resend timer** ("Resend in 30s" → "Resend").
- **A11y:** grouped label, announces "code, N of 6".

### Select / Dropdown

- Trigger (Input-like) + list (Sheet on phone, popover/menu on desktop). **A11y:** `role="combobox"`
  or `radiogroup`, selected option announced.

### Checkbox / Radio

- `line-strong` control, black/white check when selected. **A11y:** `role="checkbox"`/`"radio"`,
  `checked` state, 44px target.

### Switch

- Black/white track + thumb (monochrome); optional label. **A11y:** `role="switch"`, `checked` state,
  labelled.

### Chip — three roles

- **Filter toggle** (`role="button"`, `aria-pressed`), **category link** (`role="link"`), **tab**
  (`role="tab"`, `aria-selected`). Pill (surface + border); selected = black bg / white text
  (inverted in dark). Keep the role explicit per use.

### QuantityStepper

- Minus / count / plus (IconButtons + number); disables at stock limit; error toast if exceeded.
  **A11y:** labelled "Quantity", buttons labelled "increase"/"decrease".

### RatingInput

- Selectable 1–5 stars (filled vs outline) + optional comment; shows the chosen value as text too.
  **A11y:** `role="radiogroup"` of star buttons, each labelled "1 star"…"5 stars".

### DatePicker

- Native date picker on phone; a calendar/input popover on web. **A11y:** labelled, announced value.

### SearchBar

- Input variant with a search icon and clear button; debounced; submits on Enter (web) / search key.
  **A11y:** `role="search"`, labelled.

## 2. Display components

### ProductCard — two variants

- **Fixed-ratio (grid):** 4:5 image. **Variable-ratio (masonry):** natural image height, stable
  aspect ratio from `tokens.md`. `lg` radius, `surface` bg + 1px `line`.
- **Overlays: at most two items** (Thrift badge + "Sold out") with a `scrim` — never a gradient.
  The only badge is **Thrift** (no "Made in Nigeria").
- Below: name (2 lines), vendor ("By …"), then a price row: `Price` left, wishlist heart right.
  Rating summary (star + rounded average) shown only when ratings exist, never NaN. Strikethrough
  old price when `old_price > price`; "Free" when price is 0.
- **A11y:** the navigating card is `role="link"` labelled with name + price. The **heart is a
  sibling, not a child**, label "Add to wishlist" ↔ "Saved".

### StoreCard / StoreCircle

- Circle avatar + name; approval status shown only when the data supports it. **A11y:** labelled
  "Store: {name}".

### NewsCard (Fashion news)

- 16:9 image, title (2 lines), excerpt, author + date + read time. Same chrome as ProductCard.

### Avatar

- Sizes from `tokens.md` (24/32/40/56/96); circle; initials or image; neutral placeholder if empty.

### Badge

- Count (unread, cart) on a black/white pill; status badges (stock, approval) pair icon + label with
  the muted semantic color.

### RatingStars

- Star row (filled vs outline, single-color) + numeric average. **"No ratings yet"** text when there
  is no rating — never an empty star row.

### Price

- `formatNaira` (₦ + thousands separators, no decimals) in `fg`, bold for emphasis.

### Image (with placeholder)

- `contentFit: cover`, **skeleton** placeholder (no `blurhash` — the backend stores none), lazy +
  compressed, requested at the width from `layout-system.md` Image sizing. **Error fallback:** a
  neutral gray placeholder + icon on load failure (never a broken/blank frame).

### Skeleton

- Shapes **per component**, matching the final layout exactly (no shift): card = 4:5 block + two text
  lines; row = avatar + two lines; text = 1–2 lines (60–90% width); hero/banner = 16:9 block;
  section header = one title line. Neutral `skeleton` token, gentle pulse (respects reduced motion).
  Used for all first paints — never a bare spinner.

### SectionHeader

- Title (left) + optional action/link (right, "See all"). **A11y:** heading level; action labelled.

### Carousel

- Horizontal paged banner slider: one slide per banner, ordered by `position`. Ratio `img-banner`
  (16:9), wider `img-banner-wide` at 768+. Loads only the current and next images.
- Title + text overlaid on a solid `scrim`; a slide is a link only when its `url` is whitelisted.
- Autoplay ~6s with a pause/play button; none under reduced motion; stops after any interaction
  and pauses when backgrounded or off screen. Prev/next buttons + labelled dots ("Slide 2 of 3");
  keyboard left/right on web. **A11y:** slides labelled, dots/buttons `role`/label.

### ReviewCard

- Reviewer name + date + `RatingStars` + comment. Same row chrome as `ListItem`.

### CommentThread

- Nested comments with indentation, reply action, and delete (owner only). **A11y:** nesting
  reflected in the accessibility tree; "Reply to {author}".

### TrustBadge

- Only data-supported signals: ratings, store approval status, stock, Thrift, Made in Nigeria.
  Icon + label; no invented verification badges (see `backlog.md`).

## 3. Navigation & layout

### TopBar

- Phone (375px): **logo, SearchBar, Cart (badge), Notifications (badge)** — account lives under the
  Profile tab. Desktop adds the account entry. 56px (mobile) / 64px (desktop). Cart is an icon +
  badge, never a tab. **No Messages icon** (messaging is entered from a storefront "Message vendor"
  and from orders — no conversation list yet).
- **A11y:** each icon labelled; badges announce counts.

### BottomTabBar / Sidebar

- Five entries: Home, Discover, Runway, Makeup, Profile. 44px targets; active state = filled icon +
  label (`fg`), inactive = outline + `fg-muted`. Sidebar (≥1024) repeats the same five.
- **A11y:** `role="tablist"` / nav landmarks, `selected` state, labels.

### ScreenHeader

- Back (IconButton, mirror-in-RTL), title, optional right actions. **A11y:** back labelled "Back".

### Tabs (segmented)

- Top/segmented tabs using the Chip **tab** role; scrollable on phone. Used for profile sections and
  the vendor store strip (products / makeup / runway / orders / banks).

## 4. Feedback & state

### Toast

- Single module (replaces the old app's four toast libs). Success/warning/error/info = muted
  semantic color + icon + text. Auto-dismiss; one at a time. **A11y:** live region, non-blocking.
  (See the feedback decision guide at the end.)

### EmptyState

- Icon (muted) + title + one-line hint + optional primary action ("Browse", "Refresh").
  **No-results variant** for searches/filters ("No results for …" + clear-filters action).

### ErrorState / OfflineState

- Icon + title + message + **Retry** (primary button). Offline explains what's cached vs needed;
  includes a "last updated" cue for manual-refresh surfaces (messaging, F14).

### InlineBanner

- Persistent, non-modal status strip (icon + text + optional action) for ongoing states: store
  "awaiting approval", "payment failed — retry", offline. Does **not** auto-dismiss.

### Loading

- Skeleton for first paint (matches layout); small spinner only for in-place actions (button,
  footer pagination).

### Pagination

- **Client-side only** — the backend returns full lists with no pagination; slice/paginate in memory
  (see `docs/backend-findings.md`).
- States: **loading-more** (footer spinner/skeleton), **end-of-list** ("You're all caught up"),
  **load-more-failed** (inline retry). Keyed by stable IDs; no duplicate rows.

### PaymentStatus

- Post-payment outcome: success / failed / pending with icon + label + amount + reference, and a
  retry/recovery action where the reference is unverified (see audit F8).

## 5. Overlays

### Sheet

- Bottom sheet on phone; **centered dialog at ≥1024**. `surface-overlay` + `modal-backdrop`.
  Draggable handle (phone) with a **non-drag alternative** (close button). **A11y:** modal role,
  focus trapped, Escape/back dismisses.

### Dialog (confirm)

- Title, body, primary + secondary actions (e.g., approve/reject, delete account, remove item).
  `error` accent + icon for destructive actions. Focus trap + labelled.

### ModalBackdrop

- Uses the **`modal-backdrop` token** (`rgba(0,0,0,0.5)`); tap-to-dismiss where non-destructive;
  blocks the page behind.

### FilterSheet

- Bottom sheet / dialog with filter `Chip` toggles and a **sort control** (radio list of sort
  options); Apply + Clear actions.

### ImageGallery

- Fullscreen image viewer (product/store galleries): swipe + prev/next buttons + thumbnails, and a
  **non-drag alternative** (arrows); dismiss button.

## 6. Domain components

### ListItem (rows)

- Variants: settings row (icon + label + chevron), notification row (avatar + text + unread dot +
  time), order row (thumbnail + status + `Price`), address row (icon + name/phone + default tag).
- **A11y:** each row one labelled `role="button"` where tappable; unread announced.

### OrderStatusStepper (F13)

- **One enum map** drives **custom-order, standard-order, and service** flows (each flow lists its
  states + allowed next transitions — see `audit.md` F13). Shows current + completed steps with
  label + icon; renders **only the valid next action** per role. Never string compares.

### OrderSummary

- Line items (qty × name) + subtotal, delivery, discount, and `Price` total; sticky in the
  cart/checkout two-column template.

### CartItem

- Thumbnail + name + `Price` + `QuantityStepper` + remove (Dialog confirm). Stock-limited; "Out of
  stock" via `Badge`. **A11y:** labelled with name, price, quantity.

### AddressForm

- Forgiving fields: state → **LGA (needs confirmation against `/addUserAddress`)** → landmark/
  informal address; `PhoneInput`; "Set as default". `zod` validation. Do **not** add fields the
  backend does not store.

### MeasurementInput (custom orders)

- Numeric fields with a **unit label** (cm/in) and range validation; description textarea.

### MediaUploader

- Pick/capture images; compress; show progress + error/retry; preview grid with remove.

### MultiStepProgress

- Step indicator for wizards (store create, reset password, checkout): numbered steps + labels,
  completed/active/upcoming states.

### CategoryPicker

- Drill-down category → subcategory → product type using `Chip` links and a `Select`/Sheet.

### RunwayVideoOverlay

- Full-bleed video with **tap-to-play data-saver state** (paused overlay + "Tap to play"); like/
  comment/share actions; product tags. Respects the Wi-Fi-only autoplay default (F5).

### Accordion

- Expandable section (help/FAQ): header + chevron, expanded content; `role="button"`,
  `aria-expanded`.

### LegalDocument

- Long-form content (privacy/terms/refund/return) at 720 max; heading hierarchy; system fonts.

### Table (vendor desktop)

- Vendor dashboard data at ≥1024: sortable columns, row selection; falls back to cards on phone.

### BalanceCard / StatCard

- Metric (balance, orders, sales) with label + value + optional delta; monochrome.

### MessageBubble / Composer / thread header (F14)

- `MessageBubble` (own/other, `sending → sent → failed (retry)`), `Composer` (input + send,
  disabled when empty), and a thread header (counterparty + manual refresh + "last updated"). The
  `useMessages(threadId)` hook + `MessagesTransport` live in the F14 screen spec. **Transport = HTTP
  (`/getMessages`, `/createMessage`) + SSE (`/sse/messages`); no conversation list/unread yet.**

## 7. Feedback decision guide

- **Toast** — transient success (added to cart, saved, copied) and non-blocking confirmations.
- **Inline error** — form validation (under the field, never a toast).
- **Dialog** — confirmations/destructive actions (delete, approve/reject, remove).
- **InlineBanner** — persistent state (store approval, offline, payment failed).
- **Errors that need action (e.g., payment failed) never auto-dismiss.** No native `Alert` — use the
  toast/inline/dialog system.

## 8. Components × states matrix

States: **D**efault, **P**ressed, **F**ocused, **Dis**abled, **L**oading, **E**rror.

| Component                          | D   | P   | F   | Dis | L   | E   |
| ---------------------------------- | --- | --- | --- | --- | --- | --- |
| Button                             | ✓   | ✓   | ✓   | ✓   | ✓   | n/a |
| IconButton                         | ✓   | ✓   | ✓   | ✓   | n/a | n/a |
| Input                              | ✓   | n/a | ✓   | ✓   | n/a | ✓   |
| PhoneInput                         | ✓   | n/a | ✓   | ✓   | n/a | ✓   |
| OtpInput                           | ✓   | n/a | ✓   | ✓   | n/a | ✓   |
| Select                             | ✓   | n/a | ✓   | ✓   | n/a | ✓   |
| Checkbox / Radio / Switch          | ✓   | ✓   | ✓   | ✓   | n/a | n/a |
| Chip                               | ✓   | ✓   | ✓   | ✓   | n/a | n/a |
| QuantityStepper                    | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   |
| ProductCard / NewsCard / StoreCard | ✓   | ✓   | ✓   | n/a | n/a | n/a |
| Image                              | n/a | n/a | n/a | n/a | ✓   | ✓   |
| Skeleton                           | ✓   | n/a | n/a | n/a | n/a | n/a |
| SearchBar                          | ✓   | n/a | ✓   | ✓   | n/a | n/a |
| Sheet / Dialog                     | ✓   | n/a | ✓   | n/a | n/a | n/a |
| CartItem                           | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   |
| Pagination                         | n/a | n/a | n/a | n/a | ✓   | ✓   |
| MediaUploader                      | ✓   | n/a | ✓   | ✓   | ✓   | ✓   |
| OrderStatusStepper                 | ✓   | n/a | ✓   | n/a | n/a | n/a |

"n/a" = not applicable; loading/error render via `Loading` / `ErrorState` / `InlineBanner`.

## 9. Accessibility rules (all components)

- Min touch target **44×44**; two-tone focus ring on every interactive element; `role` + accessible
  label; states announced (loading/disabled/selected); color never the only cue (icon + label);
  reduced-motion respected; large text up to 200% (fixed-height elements cap at 1.3).
- **Non-drag alternatives:** sheets, carousels, image galleries and Runway all provide buttons/
  arrows (not swipe-only).
- **Focus never hidden by sticky bars:** sticky bottom/top bars add matching padding/insets so the
  focused element stays visible.
- **Web:** landmarks (`header/nav/main/footer`), a **skip link** to main content, one `h1` per
  screen with a heading hierarchy, and **focus management on route change** (move focus to the new
  screen heading, restore focus on back).

## 10. Completeness note

After the screen specs are written, add any component a screen uses that is missing here.
