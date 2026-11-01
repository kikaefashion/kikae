# Kikae — Design Tokens

Single source of truth for all values. Principles live in `design-principles.md`; these tokens
must be the only place a color, size, radius, or duration is defined. No one-off values in screens.

## 1. Neutral gray scale (the only structural colors)

Monochrome identity: black, white, and this neutral scale are the only colors for structure.

| Step       | Hex       | Use                                                                       |
| ---------- | --------- | ------------------------------------------------------------------------- |
| `gray-50`  | `#FAFAFA` | `canvas` (light) / `fg` (dark)                                            |
| `gray-100` | `#F5F5F5` | spare step                                                                |
| `gray-200` | `#E5E5E5` | `line` (light) / `divider` (light) / `skeleton` (light)                   |
| `gray-300` | `#D4D4D4` | `fg-secondary` (dark) / `primary-disabled` (light)                        |
| `gray-400` | `#A3A3A3` | `fg-muted` (dark) / `fg-disabled` (light) / `on-primary-disabled` (dark)  |
| `gray-500` | `#737373` | `line-strong` / `fg-placeholder` (light)                                  |
| `gray-600` | `#525252` | `fg-muted` (light) / `fg-disabled` (dark) / `on-primary-disabled` (light) |
| `gray-700` | `#404040` | `fg-secondary` (light) / `line` (dark) / `primary-disabled` (dark)        |
| `gray-800` | `#262626` | `surface-overlay` (dark) / `skeleton` (dark)                              |
| `gray-900` | `#171717` | `fg` (light) / `surface` (dark)                                           |
| `gray-950` | `#0A0A0A` | `canvas` (dark)                                                           |

Pure `#000000` and `#FFFFFF` are reserved for brand moments and primary buttons only.

## 2. Semantic colors (muted, sparing, always with icon + label)

Used only for success / warning / error / info status, and **never** alone — always paired with an
icon and a text label. Muted tones for light and dark:

| Role      | Light     | Dark      |
| --------- | --------- | --------- |
| `success` | `#1B7F4A` | `#4ADE80` |
| `warning` | `#8A5A00` | `#FFD699` |
| `error`   | `#B3261E` | `#F2B8B5` |
| `info`    | `#1B5E8A` | `#9BD0F5` |

These are accent colors for icons/labels, not large fills; contrast is verified on every surface in
the Contrast ratios section below.

## 3. Semantic color roles (light + dark)

| Role                                    | Light              | Dark               |
| --------------------------------------- | ------------------ | ------------------ |
| `canvas` (page)                         | `gray-50 #FAFAFA`  | `gray-950 #0A0A0A` |
| `surface` (cards/raised)                | `#FFFFFF`          | `gray-900 #171717` |
| `surface-overlay` (sheet/dialog)        | `#FFFFFF`          | `gray-800 #262626` |
| `line` (decorative border)              | `gray-200 #E5E5E5` | `gray-700 #404040` |
| `line-strong` (inputs/controls)         | `gray-500 #737373` | `gray-500 #737373` |
| `divider`                               | `gray-200 #E5E5E5` | `gray-800 #262626` |
| `fg` (primary text)                     | `gray-900 #171717` | `gray-50 #FAFAFA`  |
| `fg-secondary`                          | `gray-700 #404040` | `gray-300 #D4D4D4` |
| `fg-muted`                              | `gray-600 #525252` | `gray-400 #A3A3A3` |
| `fg-disabled`                           | `gray-400 #A3A3A3` | `gray-600 #525252` |
| `fg-placeholder`                        | `gray-500 #737373` | `gray-400 #A3A3A3` |
| `on-primary`                            | `#FFFFFF`          | `#000000`          |
| `on-primary-disabled`                   | `gray-600 #525252` | `gray-400 #A3A3A3` |
| `primary` (button bg)                   | `#000000`          | `#FFFFFF`          |
| `primary-pressed`                       | `gray-800 #262626` | `gray-200 #E5E5E5` |
| `primary-disabled`                      | `gray-300 #D4D4D4` | `gray-700 #404040` |
| `icon`                                  | `gray-900`         | `gray-50`          |
| `icon-muted`                            | `gray-600`         | `gray-400`         |
| `skeleton`                              | `gray-200 #E5E5E5` | `gray-800 #262626` |
| `scrim` (pill/chip behind overlay text) | `rgba(0,0,0,0.6)`  | `rgba(0,0,0,0.6)`  |
| `modal-backdrop`                        | `rgba(0,0,0,0.5)`  | `rgba(0,0,0,0.5)`  |

**Decision:** light page `canvas` = `gray-50 #FAFAFA`; cards are separated by the 1px `line` border
and `gray-200` `divider` (not by tone, which is only 1.04:1). **`link`** = underline + weight 500/700
in `fg` (no color change). The `scrim` is applied only as a **pill/chip behind overlay text**, never
over the whole image.

## 4. Contrast ratios (WCAG 2.2 AA)

Computed with a script (WCAG 2.x relative-luminance formula). Body text must be ≥ 4.5:1; large
text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1; non-text (icons, input borders, focus) ≥ 3:1.

### Neutral text pairs

| Pair (text on background)                                   | Ratio | AA                                      |
| ----------------------------------------------------------- | ----- | --------------------------------------- |
| `fg #171717` on `surface #FFFFFF`                           | 17.93 | AAA ✓                                   |
| `fg #171717` on `canvas #FAFAFA`                            | 17.18 | AAA ✓                                   |
| `fg-secondary #404040` on `#FFFFFF`                         | 10.37 | AAA ✓                                   |
| `fg-secondary #404040` on `#FAFAFA`                         | 9.93  | AAA ✓                                   |
| `fg-muted #525252` on `#FFFFFF`                             | 7.81  | AA ✓                                    |
| `fg-muted #525252` on `#FAFAFA`                             | 7.49  | AA ✓                                    |
| `fg-placeholder #737373` on `#FFFFFF`                       | 4.74  | AA ✓                                    |
| `fg-placeholder #737373` on `#FAFAFA`                       | 4.54  | AA ✓ (borderline — prefer white inputs) |
| `fg-disabled #A3A3A3` on `#FFFFFF`                          | 2.52  | exempt (decorative)                     |
| `on-primary #FFFFFF` on `primary #000000`                   | 21.00 | AAA ✓                                   |
| `on-primary-disabled #525252` on `primary-disabled #D4D4D4` | 5.27  | AA ✓                                    |
| `fg #FAFAFA` on `canvas #0A0A0A`                            | 18.97 | AAA ✓                                   |
| `fg-secondary #D4D4D4` on `#0A0A0A`                         | 13.36 | AAA ✓                                   |
| `fg-muted #A3A3A3` on `#0A0A0A`                             | 7.85  | AA ✓                                    |
| `fg-muted #A3A3A3` on `surface #171717`                     | 7.11  | AA ✓                                    |
| `fg-muted #A3A3A3` on `surface-overlay #262626`             | 6.00  | AA ✓                                    |
| `on-primary #000000` on `primary #FFFFFF`                   | 21.00 | AAA ✓                                   |
| `on-primary-disabled #A3A3A3` on `primary-disabled #404040` | 4.11  | AA ✓ (large/non-body)                   |
| `#525252` on `#0A0A0A` (forbidden)                          | 2.53  | ✗ do not use                            |

### Semantic pairs (icon + label, verified on every surface)

Light semantic = `#1B7F4A` / `#8A5A00` / `#B3261E` / `#1B5E8A`; dark = `#4ADE80` / `#FFD699` /
`#F2B8B5` / `#9BD0F5`.

| Role      | on `#FFFFFF` | on `#FAFAFA` | on `#0A0A0A` | on `#171717` | on `#262626` |
| --------- | ------------ | ------------ | ------------ | ------------ | ------------ |
| `success` | 5.02 ✓       | 4.81 ✓       | 11.36 ✓      | 10.29 ✓      | 8.68 ✓       |
| `warning` | 5.93 ✓       | 5.68 ✓       | 14.45 ✓      | 13.09 ✓      | 11.05 ✓      |
| `error`   | 6.54 ✓       | 6.26 ✓       | 11.60 ✓      | 10.50 ✓      | 8.86 ✓       |
| `info`    | 6.97 ✓       | 6.67 ✓       | 12.01 ✓      | 10.87 ✓      | 9.18 ✓       |

### Non-text & scrim

| Pair                                                   | Ratio | Requirement                   |
| ------------------------------------------------------ | ----- | ----------------------------- |
| `line-strong #737373` on `#FFFFFF`                     | 4.74  | ≥ 3:1 ✓                       |
| `line-strong #737373` on `surface #171717`             | 3.78  | ≥ 3:1 ✓                       |
| white text on `scrim` @ 60% over white (`#666666`)     | 5.74  | AA ✓                          |
| white text on `scrim` @ 70% (`#4D4D4D`)                | 8.45  | AAA ✓                         |
| white text on `scrim` @ 80% (`#333333`)                | 12.63 | AAA ✓                         |
| `surface #FFFFFF` on `canvas #FAFAFA` (elevation tone) | 1.04  | non-text only (see Elevation) |

**Rules:** body copy never uses pure `#000` on `#FFF`. `fg-disabled` is decorative and exempt from
AA, but must never be the only cue (pair with a label). On dark surfaces use `fg-muted #A3A3A3`
(never `#525252`, which fails at 2.53:1). A disabled button's label uses `on-primary-disabled`
(5.27:1 light / 4.11:1 dark), not `on-primary` (which would be 1.48:1 / 2.03:1).

## 5. Elevation (borders + tone steps, not shadows)

| Level                             | Light                          | Dark                    |
| --------------------------------- | ------------------------------ | ----------------------- |
| `0` base (page bg)                | `canvas #FAFAFA`               | `canvas #0A0A0A`        |
| `1` raised (cards, list items)    | `surface #FFFFFF` + 1px `line` | `gray-900` + 1px `line` |
| `2` overlay (sheet, dialog, menu) | `surface #FFFFFF` + 1px `line` | `gray-800` + 1px `line` |

Higher levels are **lighter in dark mode**. Shadows are reserved for floating elements (FAB, sheet)
and kept subtle (`elevation`/`boxShadow` only there); never the primary elevation cue.

**Light-mode note:** the tone step between a white card and the `#FAFAFA` page is only **1.04:1** —
too subtle to rely on. Keep the 1px `line` as the primary separator, or darken the page canvas to
`gray-100 #F5F5F5` (step 1.09:1). Do not rely on tone steps alone in light mode.

## 6. Focus, pressed, hover

- **Focus ring (two-tone):** two concentric rings — **inner 2px + 2px gap + outer 2px** (6px
  footprint) — so it reads on white, black, mid-gray, and photography. The inner ring contrasts the
  control's fill; the outer ring contrasts the background.
  - Light surface: inner `#000000`, outer `#FFFFFF`.
  - Dark surface: inner `#FFFFFF`, outer `#000000`.
  - Imagery / mid-gray: inner `#FFFFFF`, outer `#000000`.
- **Pressed:** scale `0.96` or opacity `0.7` (never a color shift).
- **Hover (web):** advance one surface tone step (or underline for text links).
- Focus is applied to every interactive element via keyboard / assistive tech; never remove it.

## 7. Type scale (one shared scale, Dynamic Type)

System fonts only — iOS `SF Pro`, Android `Roboto`, web
`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`. No bundled
fonts. Weights restricted to **400 (Regular), 500 (Medium), 700 (Bold)** — Roboto has no 600.

| Token      | Size / line-height                    | Weight | iOS style   | Material 3 role |
| ---------- | ------------------------------------- | ------ | ----------- | --------------- |
| `display`  | 34 / 41                               | 700    | Large Title | Display Small   |
| `title-1`  | 28 / 34                               | 700    | Title 1     | Headline Large  |
| `title-2`  | 22 / 28                               | 500    | Title 2     | Title Large     |
| `title-3`  | 20 / 25                               | 500    | Title 3     | Title Medium    |
| `headline` | 17 / 22                               | 500    | Headline    | Title Small     |
| `body`     | 17 / 22 (iOS) · 16 / 22 (Android/web) | 400    | Body        | Body Large      |
| `callout`  | 15 / 20                               | 400    | Callout     | Body Medium     |
| `subhead`  | 14 / 19                               | 500    | Subheadline | Body Small      |
| `footnote` | 13 / 18                               | 400    | Footnote    | Label Medium    |
| `caption`  | 12 / 16                               | 400    | Caption 1/2 | Label Small     |

`body` uses the platform default (17 iOS, 16 Android/web); all other sizes are shared. All sizes
scale with Dynamic Type / font scaling, **up to 200% (2×)** — test at 135% and 200% and never
hard-cap below 200%. Emphasis is achieved with size + weight only (see Hierarchy without color in
`design-principles.md`), never color.

## 8. Spacing scale (4px base)

`0 · 2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 80 · 96`

Use these only (no arbitrary values). Screen margins, card padding, gaps, and section spacing all
reference this scale; density (phone vs desktop) is expressed by choosing larger steps on desktop.

## 9. Radii

`xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 · full 9999`

Cards/inputs use `md`/`lg`; **buttons always use `full` (pill)**; imagery overlays use `lg`/`xl`.

## 10. Motion

| Token     | Value                        | Use                             |
| --------- | ---------------------------- | ------------------------------- |
| `fast`    | 120ms                        | press, hover, focus, toggle     |
| `base`    | 200ms                        | standard transitions            |
| `slow`    | 300ms                        | sheet/modal, screen transitions |
| `ease`    | `cubic-bezier(0.2, 0, 0, 1)` | standard                        |
| `reduced` | 0ms (disable)                | honor OS "reduce motion"        |

Purposeful and fast only; no decorative/looping animation (see Motion in `design-principles.md`).

## 11. Icon set & sizes

- **Style:** single-color (`currentColor`), 1.5px stroke at 16–20px and 2px stroke at 24px+;
  filled vs outline distinguishes selected/active from idle. No multi-color icons.
- **Sizes:** `16 · 20 · 24 · 28 · 32` (24 is the default interactive size; touch targets stay ≥ 44px).
- Icon usage and state mapping are specified per component in `components.md`.

## 12. Imagery, icons & illustrations

- **Imagery (hero):** full color, `contentFit: cover`, compressed and lazily loaded; neutral
  treatment (no color cast, no gradient scrim). Placeholder = neutral **skeleton** (no `blurhash` —
  the backend stores none); never a blank frame.
- **Aspect ratios:** product card **4:5**, banner/hero **16:9**, square **1:1**, story/video **9:16**.
- **Illustrations:** line-based, black/white/gray only.
- **Icons:** as the Icon set & sizes section above.

## 13. Formatting (Nigerian context)

- **Currency:** `₦` with thousands separators, no needless decimals — `formatNaira(12500) → ₦12,500`.
  Use one shared util everywhere.
- **Phone:** `+234` format, forgiving input (leading `0` accepted, spaces/dashes stripped).
- **Addresses:** state → **area picker** (from `logistic_destinations`) → landmark/informal address,
  loose validation (no LGA).
- **Date/time:** short, humanized where useful ("3 days ago") with an absolute timestamp on tap.

## 14. Size & interaction tokens

| Token              | Value |
| ------------------ | ----- |
| `touch-target-min` | 44×44 |
| `avatar-xs`        | 24    |
| `avatar-sm`        | 32    |
| `avatar-md`        | 40    |
| `avatar-lg`        | 56    |
| `avatar-xl`        | 96    |
| `img-card`         | 4:5   |
| `img-banner`       | 16:9  |
| `img-square`       | 1:1   |
| `img-story`        | 9:16  |

## 15. Token → utility mapping

Each token maps to a Tailwind/NativeWind utility and a CSS variable so the Tailwind config can be
generated from this table. Light/dark flip via `:root` / `.dark` variables. **The Tailwind theme
overrides (not extends) the defaults**, so values outside these scales do not compile.

### Colors

| Token                                       | CSS variable                          | Utility                           |
| ------------------------------------------- | ------------------------------------- | --------------------------------- |
| `canvas`                                    | `--kikae-canvas`                      | `bg-canvas`                       |
| `surface`                                   | `--kikae-surface`                     | `bg-surface`                      |
| `surface-overlay`                           | `--kikae-surface-overlay`             | `bg-surface-overlay`              |
| `line`                                      | `--kikae-line`                        | `border-line`                     |
| `line-strong`                               | `--kikae-line-strong`                 | `border-line-strong`              |
| `divider`                                   | `--kikae-divider`                     | `divide-divider`                  |
| `fg`                                        | `--kikae-fg`                          | `text-fg`                         |
| `fg-secondary`                              | `--kikae-fg-secondary`                | `text-fg-secondary`               |
| `fg-muted`                                  | `--kikae-fg-muted`                    | `text-fg-muted`                   |
| `fg-disabled`                               | `--kikae-fg-disabled`                 | `text-fg-disabled`                |
| `fg-placeholder`                            | `--kikae-fg-placeholder`              | `text-fg-placeholder`             |
| `on-primary`                                | `--kikae-on-primary`                  | `text-on-primary`                 |
| `on-primary-disabled`                       | `--kikae-on-primary-disabled`         | `text-on-primary-disabled`        |
| `primary`                                   | `--kikae-primary`                     | `bg-primary`                      |
| `primary-pressed`                           | `--kikae-primary-pressed`             | `bg-primary-pressed`              |
| `primary-disabled`                          | `--kikae-primary-disabled`            | `bg-primary-disabled`             |
| `icon` / `icon-muted`                       | `--kikae-icon` / `--kikae-icon-muted` | `text-icon` / `text-icon-muted`   |
| `skeleton`                                  | `--kikae-skeleton`                    | `bg-skeleton`                     |
| `scrim`                                     | `--kikae-scrim`                       | `bg-scrim`                        |
| `modal-backdrop`                            | `--kikae-modal-backdrop`              | `bg-modal-backdrop`               |
| semantic `success`/`warning`/`error`/`info` | `--kikae-{role}`                      | `text-{role}` (icon + label only) |
| `link`                                      | — (uses `fg`)                         | `underline` + weight 500/700      |

### Spacing, radii, type & motion

| Token                     | Utility                                                      |
| ------------------------- | ------------------------------------------------------------ |
| spacing scale (`0…96`)    | `p-*` / `m-*` / `gap-*` (mapped 1:1 to px)                   |
| radii (`xs…2xl, full`)    | `rounded-*` (mapped)                                         |
| type (`display…caption`)  | `text-*` (size + line-height + weight from the type scale)   |
| motion (`fast/base/slow`) | `duration-fast` / `duration-base` / `duration-slow` + `ease` |

Semantic color utilities are icon/label accents only, never fills or solo status cues.
