# Kikae — Build Brief

Condensed source of truth. Read this instead of `tokens.md`, `design-principles.md`,
`layout-system.md`. Runtime source: `src/theme/tokens.ts` → `tailwind.config.js` + `src/global.css`.

## Token → utility mapping

### Colors (light/dark flip via `--kikae-*` CSS vars in `src/global.css`)

| Token                              | Utility                                 |
| ---------------------------------- | --------------------------------------- |
| `canvas`                           | `bg-canvas`                             |
| `surface`                          | `bg-surface`                            |
| `surface-overlay`                  | `bg-surface-overlay`                    |
| `line`                             | `border-line`                           |
| `line-strong`                      | `border-line-strong`                    |
| `divider`                          | `divide-divider`                        |
| `fg`                               | `text-fg`                               |
| `fg-secondary`                     | `text-fg-secondary`                     |
| `fg-muted`                         | `text-fg-muted`                         |
| `fg-disabled`                      | `text-fg-disabled`                      |
| `fg-placeholder`                   | `text-fg-placeholder`                   |
| `on-primary`                       | `text-on-primary`                       |
| `on-primary-disabled`              | `text-on-primary-disabled`              |
| `primary`                          | `bg-primary` / `text-primary`           |
| `primary-pressed`                  | `bg-primary-pressed`                    |
| `primary-disabled`                 | `bg-primary-disabled`                   |
| `icon`                             | `text-icon`                             |
| `icon-muted`                       | `text-icon-muted`                       |
| `skeleton`                         | `bg-skeleton`                           |
| `scrim`                            | `bg-scrim`                              |
| `modal-backdrop`                   | `bg-modal-backdrop`                     |
| `success`/`warning`/`error`/`info` | `text-{role}` (icon + label only)       |
| `link`                             | no color — `underline` + weight 500/700 |

- Neutral gray `gray-50`…`gray-950` → `bg-gray-{step}` / `text-gray-{step}` / `border-gray-{step}`.
- Semantic `success`/`warning`/`error`/`info` are icon/label accents, never fills or solo cues.

### Spacing / radii / type / motion

| Token                                                                                 | Utility                                                                       |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| spacing `0 2 4 8 12 16 20 24 32 40 48 56 64 80 96`                                    | `p-*` / `m-*` / `gap-*` (1:1 px)                                              |
| radii `xs4 sm8 md12 lg16 xl24 2xl32 full9999`                                         | `rounded-*`; buttons always `rounded-full`                                    |
| type `display title-1 title-2 title-3 headline body callout subhead footnote caption` | `text-{variant}` (size + line-height + weight)                                |
| weight `regular400 medium500 bold700`                                                 | `font-*`                                                                      |
| motion `fast120 base200 slow300`                                                      | `duration-fast` / `duration-base` / `duration-slow` + `ease`; `reduced` = 0ms |

## Hard rules

- No hex / rgba color literals outside `src/theme` (enforced by `src/components/ui/__tests__/design-rules.test.ts`).
- No Tailwind arbitrary values (`-[…]`) anywhere.
- No dynamically built class names (e.g. `` `bg-${color}` ``) — NativeWind needs statically analyzable strings.
- Variant class maps use full-string literals (`Record<Variant, string>`), never template concatenation.
- Tailwind theme **overrides** (not extends) defaults — values outside the scales do not compile.
- No one-off colors / spacing / radii / durations in screens or components.
- Light/dark flip only via `--kikae-*` CSS vars; never hard-code one scheme.

## Accessibility baseline

- Touch targets ≥ 44×44 (`TOUCH_TARGET`, from `sizes['touch-target-min']`).
- Every interactive element: `accessibilityRole` + `accessibilityLabel` + `accessibilityState` (`disabled`/`busy`/`checked`/`selected`).
- Web: landmarks, skip link, one `h1` per screen, heading hierarchy, focus management on route change.
- Two-tone focus ring (web): `.focus-ring:focus-visible` in `src/global.css` = 2px inner `--kikae-primary` + 2px gap + 2px outer `--kikae-surface`. Apply `focusRing` const to every interactive element.
- Pressed: scale 0.96 or opacity 0.7. Hover (web): one surface tone step or underline. Never color shifts.
- Reduced motion: honor OS setting (`reduced` → 0ms).
- `maxFontSizeMultiplier`: default `2` (200%) on reading/body text; cap `1.3` on fixed-height elements (buttons, tab labels, badges, table cells). Never hard-cap below 200% for reading text.
- Color is never the only cue: semantic color always pairs with icon + label.

## Layout

- Breakpoints: `base 0` `sm 640` `md 768` `lg 1024` `xl 1280` `2xl 1536`.
- Grid (container-based): `gap = width ≥ 1024 ? 24 : 16`;
  `columns = clamp(2, floor((containerWidth + gap) / (160 + gap)), 5)`.
  One shared `useColumnCount(containerWidth)` in `src/utils/layout.ts` — never hand-rolled.
- Nav: `< 1024` bottom tab bar (Home, Discover, Runway, Makeup, Profile; Cart is NOT a tab);
  `≥ 1024` left sidebar (256 wide, same five entries).
- Top bar 56 (mobile) / 64 (desktop); tab bar 56 + safe-area inset. Max content width 1200/1280/1440; reading 720, forms 480.
- Masonry = Discover (variable heights); uniform 4:5 grid = product catalogs. Stable ratios: 4:5, 16:9, 1:1, 9:16.

## Component file structure

- Primitive: `src/components/ui/<name>.tsx`; barrel export in `src/components/ui/index.ts`.
- Co-located tests: `src/components/ui/__tests__/<name>.test.tsx`.
- Tokens/theme: `src/theme/tokens.ts` + `tailwind.config.js` + `src/global.css`.
- Shared test render: `src/test-utils/render.tsx` (SafeAreaProvider + QueryClientProvider).
- Platform-specific overrides: `<name>.web.tsx` alongside `<name>.tsx`.

## Test conventions

- Query by role / label / text — never `testID`.
- Cover loading, error, empty, and populated states.
- Mock all network calls with typed MSW handlers.
- No whole-screen snapshot tests; no `any`.
- Every bug fix ships a regression test.
- New feature folder → add to `collectCoverageFrom` in `jest.config.js` + tests.
- Guard rails: `design-rules.test.ts` scans `src` for hex + arbitrary values.
- Run: `yarn test <path>` + `yarn typecheck`; full `yarn validate` at end of task.

## Adding a design-system showcase entry

1. Edit `src/components/design-system/showcase.tsx`.
2. Import the component from `@/components/ui/<name>`.
3. Add a `<Section title="<Name>">…</Section>` block (reuse the local `Row` helper) rendering every variant/state.
4. Local interactive state via `useState`; respect the existing `mode` toggle (`colorScheme.set`).
5. Route `/design-system` is dev-only (`__DEV__`); it stays out of production bundles.
