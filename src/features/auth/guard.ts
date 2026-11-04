import type { SessionStatus } from '@/session/session-store';

export interface RouteGuards {
  tabs: boolean;
  auth: boolean;
}

/**
 * Root gate: signed-in or guest users see the tab group; everyone else is
 * routed to login. While the session is still hydrating we keep the tabs guard
 * open so the splash (not a redirect) covers the transition.
 */
export function resolveGuards(
  status: SessionStatus,
  guest: boolean,
): RouteGuards {
  const loading = status === 'loading';
  const authorized = status === 'signedIn' || guest;
  return {
    tabs: loading || authorized,
    auth: !loading && !authorized,
  };
}
