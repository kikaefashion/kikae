import type { Href } from 'expo-router';

/**
 * Resolves the destination for a protected action. Signed-in users go straight
 * to `target`; guests are sent to `/login` with a `redirectTo` back to the
 * current path so they resume the action after signing in.
 */
export function requireAuth(
  target: Href,
  signedIn: boolean,
  pathname: string,
): Href {
  if (signedIn) return target;
  return `/login?redirectTo=${encodeURIComponent(pathname)}` as Href;
}
