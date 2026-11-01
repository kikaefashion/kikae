# Kikae — Design Principles

Principles that guide every screen, component, and token in the monochrome rebuild. Specific
values (colors, type ramp, spacing, radii, motion) live in `tokens.md`; layout rules live in
`layout-system.md`. These three must stay consistent.

## 1. Brand & voice

- **Strictly monochrome.** Black, white, and a full neutral gray scale (50–950) are the only
  colors for structure. Pure black and pure white are reserved for brand moments and primary
  buttons; body copy and surfaces use near-black / off-white to avoid glare.
- **Semantic color is an accessory, never the message.** Success, warning, error, and info are
  muted and always paired with an icon **and** a text label — never communicated by color alone.
- **No gradients, no decorative color.** Emphasis comes from imagery, type, spacing, and borders.
- **System fonts only** — SF Pro (iOS), Roboto (Android), the system stack on web. No bundled or
  loaded font files. All type scales with Dynamic Type / font scaling.
- **Plain, friendly, direct English**, structured for later localization. Nigerian context:
  `₦` prices, `+234` phone inputs, forgiving addresses (state, LGA, landmark, informal).

## 2. Image-first discovery (Instagram/Pinterest in monochrome)

- **Imagery is the hero.** Product and vendor photography carries the visual weight that a color
  system would otherwise provide. Favor large, high-quality, lazily loaded, compressed images.
- **Borrow interaction patterns for existing features only:** wishlist as "save", the stores row
  as vendor highlights (stories-style), follow, like, and comment, and profile/storefront grids.
  Do **not** introduce collections, stories, or other new features.
- **Home is the main feed; Discover is category-first exploration.** They must not show the same
  content twice (see audit F2/F3b). Treat Home as a general feed unless the endpoint is actually
  personalized per user.
- **Trust rides on the image, not beside it.** Overlay only the signals the data supports —
  ratings, store approval status, stock, "Thrift", "Made in Nigeria" — sparingly, with a solid
  scrim or tone step (never a gradient), so legibility stays high without clutter.
- **Every image has a placeholder** — skeleton (no `blurhash` — the backend stores none) — and never
  paints a blank space.

## 3. Trust & clarity around money and orders

- **Money is always explicit.** Prices are `₦` with thousands separators and no needless decimals;
  large amounts must render cleanly in system fonts. One shared `formatNaira` util everywhere.
- **Order and payment status are first-class.** Show a status stepper (single enum — see F13) with a
  label + icon per state; the next available action is the only primary action shown. Server status
  is free-text — normalize it through one status normalizer (`trim` → lowercase → spaces to `_`,
  unknown → "unknown").
- **Trust signals show only what the data supports** — ratings/reviews, store approval status,
  stock, Thrift, Made in Nigeria, and clear order/payment status. Do **not** design verification
  badges or other signals with no backend field; list any wished-for signals in `backlog.md`.
- **Payments are protected:** confirm before paying, disable double-submit, persist the payment
  reference for recovery, verify server-side, and never infer success from a URL string.
- **Payment methods come from the existing rail** (Paystack: card, bank transfer, and the methods
  it currently supports). Never invent a provider or method.

## 4. Performance on low-end devices & weak networks

- **Design for mid/low-end Android on patchy data.** Lightweight screens, compressed + lazily
  loaded images, skeleton loading (not spinners) for first paint, and graceful offline/retry.
- **Minimize perceived waits:** show skeletons immediately, keep content above the fold fast, and
  make retry a visible, one-tap action with a clear "last updated" cue where data is manual.
- **Data-saver defaults:** media autoplay (Runway) defaults to **Wi-Fi-only**, customer-changeable
  in Settings (see audit F5).
- **Virtualize everything that scrolls**; never nest virtualized lists; memoize cards; keep the
  bundle small.

## 5. Motion

- Motion is **purposeful and fast**: short durations for feedback (press, focus) and transitions
  that clarify spatial relationships; exact durations/easing live in `tokens.md`.
- **Respect reduced motion**: honor the OS "reduce motion" setting and drop non-essential
  animation; never use decorative or looping animation as a design flourish.

## 6. Density

- **Phone (compact):** tighter vertical rhythm and single-column or 2-column grids; touch-first.
- **Desktop (comfortable):** more whitespace, multi-column grids, and larger content width; use
  the breakpoints and max-content width from `layout-system.md`.
- Density is expressed through spacing tokens (never smaller fonts below the accessible minimum);
  cards and lists reuse the same tokens so density is consistent per breakpoint.

## 7. Hierarchy without color

- Hierarchy is built from **type size and weight, spacing, borders, and layout — never color**.
- The exact emphasis ladder (primary action → section title → body → secondary → muted → disabled)
  and its type/spacing values are defined in `tokens.md`.

## 8. Elevation without shadows

- Elevation is expressed with **borders + surface tone steps**, not shadows alone.
- **Light mode:** raised surfaces step toward white + a 1px border. **Dark mode:** higher surfaces
  are **lighter** (lighter gray = closer). Use only 50–950 scale steps; any extra step is defined
  explicitly in `tokens.md`. Shadows are reserved for floating elements (FAB, sheet) and kept subtle.

## 9. Focus, pressed, hover — no color shifts

- **Focus:** a **two-tone ring** (contrasting inner + outer, per `tokens.md`) so focus is visible
  on any background — white, black, mid-gray, or over photography.
- **Pressed:** opacity or scale change (e.g., 0.96 / 70% opacity), not a color shift.
- **Hover (web):** a one-step surface tone change or underline, not a color shift.
- Component states (default / pressed / focused / disabled / loading / error) are specified in
  `components.md`.

## 10. Color & contrast (WCAG 2.2 AA)

- Body text uses **near-black on off-white** (light) and **near-white on near-black** (dark) — never
  pure `#000` on pure `#FFF` for body copy. Pure black/white is for brand moments + primary buttons.
- Every text/background pair is verified to WCAG AA (4.5:1 body, 3:1 large text) in `tokens.md`.

## 11. Typography scale

- One shared scale mapped from iOS text styles and Material 3 type roles, with Dynamic Type /
  font scaling support; the full ramp is in `tokens.md`.

## 12. Imagery, icons & illustrations in monochrome

- Icons: single-color (`currentColor`), filled vs outline for state; illustrations: line-based,
  black/white/gray; imagery: full color (photos are the hero) with neutral placeholders
  (skeleton/blurhash). Icon set, stroke weight, and sizes are enumerated in `tokens.md`.

## 13. Platform & accessibility

- Touch targets ≥ 44×44px; readable order, roles, labels; keyboard reachability + focus order on web.
- RTL-ready structure and localization-ready copy.

## 14. Local context

- Currency, phone, and address inputs follow the Nigerian context defined in §1; trust copy is
  plain and reassuring ("You'll be notified when…", refund policy) rather than boilerplate.

## 15. What to avoid

- No gradients, no decorative color, no color-only status, no bundled/custom fonts.
- No spinners where a skeleton fits; no blank screens without a loading/error/empty/offline state.
- No invented trust badges, payment methods, endpoints, or features not in `docs/inventory.md`
  (or the audit); no collections/stories beyond what the data supports.
- Degrade missing backend capabilities through a single **capabilities flag module** —
  `canUnlike`, `hasPagination`, `canResizeImages`, `hasConversationList` (all `false` today) — so
  UI flips on when the backend adds support.
- No pure `#000` on `#FFF` body copy; no color meaning without an icon + label.
