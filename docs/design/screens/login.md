# Screen spec — Login (`/login`)

## Purpose & primary action

Existing customers sign in with email + password (or Google) to reach the app, returning to the
screen that triggered sign-in. **Primary action:** "Login".

## Changes from old version

Approved in `audit.md` F1a (Needs improvement — restyle + quality, behavior preserved):
monochrome restyle with system fonts, **static labels** above fields, `react-hook-form` + `zod`
validation with inline errors, one toast module, `autoComplete`/`textContentType`, an accessible
password toggle, and a real loading state. "Continue as guest" sets a real guest flag (not a silent
navigate). Google sign-in (native) is restored per F1b.

## Layout

**Mobile (<640)** — full-width form on the `bg` canvas, brand block on top.

```
┌──────────────────────────┐
│          Logo            │
│       Welcome back       │
│   Ready to start shopping │
├──────────────────────────┤
│ Email                    │
│ ┌──────────────────────┐ │
│ └──────────────────────┘ │
│ Password                 │
│ ┌────────────────────┐   │
│ │               [eye]│   │
│ └────────────────────┘   │
│                 Forgot?  │
│ ┌──────────────────────┐ │
│ │        Login         │ │  ← Button (primary, lg)
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ Sign in with Google  │ │  ← Button (secondary, lg)
│ └──────────────────────┘ │
│    Continue as guest     │  ← Button (text)
│  New here? Create account│
└──────────────────────────┘
```

**Tablet (768) / Desktop (≥1024)** — the same form in a **centered card** on the `bg` canvas:

```
        ┌──────────────────────────┐
        │          Logo            │
        │       Welcome back       │
        │   Ready to start shopping │
        ├──────────────────────────┤
        │ Email                    │
        │ ┌──────────────────────┐ │
        │ └──────────────────────┘ │
        │ Password                 │
        │ ┌────────────────────┐   │
        │ └────────────────────┘   │
        │                 Forgot?  │
        │ [ Login ] [ Google ]     │
        │     Continue as guest    │
        │  New here? Create account│
        └──────────────────────────┘
        (max 480, lg radius, 1px border)
```

No sidebar/tab bar (see `layout-system.md` Centered form).

## Components

Button (primary/secondary/text, lg), Input (static label, rest/focus/error borders), `Loading`
(button spinner), `InlineBanner` (offline/network), `InlineBanner` (too-many-attempts). Google =
secondary Button (F1b). New: none beyond `components.md`.

## Data required

- `POST {authUrl}/login` `{email, password}` → `{ token, success }` on success, or `{ errors: "…" }`
  (HTTP 200) on failure. There is **no** `"not_verified"` machine string — derive "unverified" (and
  every other login error) from the `errors` text through **one shared constants file with tests**.
- `POST {apiUrl}/currentUser` (Bearer) → user profile (on success).
- Google: `POST {apiUrl}/social-login/google` `{access_token}` → `{ success, message, token, user }`
  (F1b, confirmed single round-trip).

## Guest behavior

"Continue as guest" opens the app with a **guest flag** (no token). Guests can browse Home,
Discover, Runway, Makeup, view products/stores, read reviews/comments, and search. Guests **cannot**
add to cart/checkout, wishlist, follow, comment/review, or open profile/orders/notifications/messages
— those actions prompt login (returning via `redirectTo`).

## States

- **Loading:** Login button shows spinner + "Logging in…", buttons disabled.
- **Populated:** default form (Login button always enabled — validation runs on submit).
- **Validation error:** empty/invalid fields → inline error under the field + focus the first
  invalid field. **No toast.**
- **Wrong credentials:** one **generic** inline error ("Email or password is incorrect") — no toast,
  no account-existence disclosure.
- **Too-many-attempts:** **no backend lockout/429** — drop this `InlineBanner` (or make it
  client-side only).
- **Network/offline:** `InlineBanner` "You're offline — check your connection" with Retry; **typed
  values are preserved**.
- **Edge:** unverified email → `/verify_email` with email pre-filled; long values scroll, no clip;
  `currentUser` failing after a successful login → show error + Retry (token already stored, do not
  loop back to login); an already-authenticated user opening `/login` → redirect to the `redirectTo`
  target (default `/`).

## Interactions, transitions, keyboard

- **Keyboard:** form is scrollable; the Login button stays **visible above the keyboard**.
  `returnKeyType` = "Next" on Email, "Done" on Password. **No auto-focus on native** (avoid
  keyboard pop on open); web may focus Email.
- Tab order = Email → Password → toggle → Forgot → Login → Google → Continue as guest.
- On submit, focus the first invalid field. Password toggle announces "hidden/shown".

## Accessibility

- Reading order: brand → email → password → actions. One `h1` ("Welcome back").
- Inputs have visible labels (`htmlFor`), `autoComplete="email"`/`"current-password"`,
  `textContentType`; password toggle labelled; Login/Google/guest are labelled buttons.
- Two-tone focus ring on all controls; ≥44px targets; inline errors announced via live region.

## Test cases

1. Empty submit → inline errors under both fields + focus Email; no request.
2. Valid credentials → token stored per platform (SecureStore native; web = bearer token in
   `localStorage`/cookie — no cookie/session auth required), `currentUser` fetched, route replaced
   to `redirectTo ?? "/"`.
3. Wrong password → generic inline error, stays on screen, no toast.
4. Unverified account → `/verify_email` with email pre-filled.
5. Network failure → `InlineBanner` with Retry; typed values preserved.
6. Google success → token persisted + home shown — **confirmed** single round-trip `{token, user}`
   (native needs a development build; web uses the OAuth flow where supported).
7. Guest: "Continue as guest" → home; then a protected action prompts login and returns via
   `redirectTo`.
8. Accessibility: label association, toggle announcement, Tab order, 200% text, focus management.
