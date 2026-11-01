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
  await tokenStorage.setToken(session.token);
  setSession(session);
  setStatus('signedIn');
}

export async function endSession(): Promise<void> {
  await tokenStorage.removeToken();
  clearSession();
  setStatus('signedOut');
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export { getAuthToken, getUserId, hasSession };
