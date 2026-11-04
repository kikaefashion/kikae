import { useSyncExternalStore } from 'react';

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

/** Hydrates the in-memory session from persisted storage (userId stays null). */
export async function restoreSession(): Promise<void> {
  const token = await tokenStorage.getToken();
  if (token) {
    setSession({ token, userId: null });
  }
  setStatus(token ? 'signedIn' : 'signedOut');
}

export async function persistSession(session: Session): Promise<void> {
  setGuest(false);
  await tokenStorage.setToken(session.token);
  setSession(session);
  setStatus('signedIn');
}

export async function endSession(): Promise<void> {
  setGuest(false);
  await tokenStorage.removeToken();
  clearSession();
  setStatus('signedOut');
}

/** Stores the resolved userId after `/currentUser` (token already persisted). */
export function setSessionUserId(userId: string | number): void {
  const token = getAuthToken();
  if (token) {
    setSession({ token, userId });
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
  return useSyncExternalStore(subscribe, () => status, () => status);
}

/** Reactive guest flag (drives the root route gate). */
export function useIsGuest(): boolean {
  return useSyncExternalStore(subscribe, () => guest, () => guest);
}

export { getAuthToken, getUserId, hasSession };
