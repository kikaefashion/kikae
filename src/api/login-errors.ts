/**
 * Login error classification + user-facing messages.
 *
 * The login endpoint returns HTTP 200 for failures and has no machine-readable
 * error code — every failure is `{ errors: "…" }`. We derive the two known
 * outcomes from that text in this one file (with tests) and map everything else
 * to a generic fallback so raw backend strings never reach the UI.
 */

export const LOGIN_ERROR_MARKERS = {
  /** "Please verify your email address before logging in." */
  unverified: 'verify your email',
  /** "The credentials you provided could not be verified." */
  invalidCredentials: 'could not be verified',
} as const;

export type LoginErrorKind = 'invalid' | 'unverified' | 'unknown';

export function classifyLoginError(errorsText: string): LoginErrorKind {
  const text = errorsText.toLowerCase();
  if (text.includes(LOGIN_ERROR_MARKERS.unverified)) return 'unverified';
  if (text.includes(LOGIN_ERROR_MARKERS.invalidCredentials)) return 'invalid';
  return 'unknown';
}

/** User-facing copy — never the raw backend strings. */
export const LOGIN_MESSAGES = {
  invalid: 'Incorrect email or password',
  unverified: 'Please verify your email address before logging in.',
  generic: 'Something went wrong. Please try again.',
  offline: "You're offline — check your connection",
  profileLoadFailed: "Couldn't load your profile.",
} as const;
