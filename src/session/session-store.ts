import { useSyncExternalStore } from 'react';

import { fetchCurrentUser } from '@/api/endpoints/current-user';
import {
  clearSession,
  getAuthToken,
  getUserId,
  hasSession,
  setSession,
  subscribeSession,
} from '@/api/identity';

import { tokenStorage } from './token-storage';

export interface Session {
  token: string;
  userId: string | number | null;
}

export type SessionStatus = 'loading' | 'signedOut' | 'signedIn';

const listeners = new Set<() => void>();
let status: SessionStatus = 'loading';
let guest = false;

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

function setStatus(next: SessionStatus): void {
  if (status !== next) {
    status = next;
    notify();
  }
}

// Keep status in sync with identity changes (e.g. the API client clears the
// session on a 401 with no refresh flow).
subscribeSession(() => {
  setStatus(hasSession() ? 'signedIn' : 'signedOut');
});

export function getSessionStatus(): SessionStatus {
  return status;
}

/** Hydrates the in-memory session (token + user id) from persisted storage. */
export async function restoreSession(): Promise<void> {
  const token = await tokenStorage.getToken();
  if (token) {
    const userId = await tokenStorage.getUserId();
    setSession({ token, userId });
  }
  setStatus(token ? 'signedIn' : 'signedOut');
}

export async function persistSession(session: Session): Promise<void> {
  setGuest(false);
  await tokenStorage.setToken(session.token);
  if (session.userId !== null) {
    await tokenStorage.setUserId(session.userId);
  }
  setSession(session);
  setStatus('signedIn');
}

export async function endSession(): Promise<void> {
  setGuest(false);
  await tokenStorage.removeToken();
  await tokenStorage.removeUserId();
  clearSession();
  setStatus('signedOut');
}

/** Stores the resolved userId after `/currentUser` (token already persisted). */
export function setSessionUserId(userId: string | number): void {
  const token = getAuthToken();
  if (token) {
    setSession({ token, userId });
    void tokenStorage.setUserId(userId);
  }
}

/** Guest browsing flag (no token). Resets on sign-in/sign-out. */
export function isGuest(): boolean {
  return guest;
}

export function setGuest(next: boolean): void {
  if (guest !== next) {
    guest = next;
    notify();
  }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Reactive session status (drives the root route gate). */
export function useSessionStatus(): SessionStatus {
  return useSyncExternalStore(
    subscribe,
    () => status,
    () => status,
  );
}

/** Reactive guest flag (drives the root route gate). */
export function useIsGuest(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => guest,
    () => guest,
  );
}

/** Reactive user id — null for guests or until `/currentUser` resolves. */
export function useUserId(): string | number | null {
  return useSyncExternalStore(
    subscribeSession,
    () => getUserId(),
    () => getUserId(),
  );
}

/**
 * Backfills the user id when a persisted token exists but its id was not
 * persisted (sessions stored before the id was persisted). No-op when signed
 * out or already resolved. Resolves `true` on success; `false` leaves the id
 * null so the caller can retry.
 */
export async function hydrateSessionUser(): Promise<boolean> {
  if (!hasSession() || getUserId() !== null) return true;
  try {
    const user = await fetchCurrentUser();
    setSessionUserId(user.id);
    return true;
  } catch {
    return false;
  }
}

export { getAuthToken, getUserId, hasSession };
