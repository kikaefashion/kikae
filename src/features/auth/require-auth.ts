import type { Href } from 'expo-router';

import type { SessionStatus } from '@/session/session-store';

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

export type HeartAction = 'wait' | 'login' | 'proceed';

/**
 * Decides what a protected heart tap should do for the current session state:
 * do nothing while hydrating, redirect to login for guests / signed-out users,
 * or proceed for signed-in users.
 */
export function resolveHeartAction(status: SessionStatus): HeartAction {
  if (status === 'loading') return 'wait';
  if (status === 'signedIn') return 'proceed';
  return 'login';
}
