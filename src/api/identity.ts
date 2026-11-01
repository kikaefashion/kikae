/**
 * Single source of the current session identity (token + userId).
 *
 * Endpoint wrappers read `getUserId()` here — never from screens. The client
 * reads `getAuthToken()` here to inject the Bearer header in one place, and
 * clears it on 401 (no refresh flow).
 */

export interface Session {
  token: string;
  userId: string | number | null;
}

let session: Session | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getAuthToken(): string | null {
  return session?.token ?? null;
}

export function getUserId(): string | number | null {
  return session?.userId ?? null;
}

export function setSession(next: Session): void {
  session = next;
  notify();
}

export function clearSession(): void {
  session = null;
  notify();
}

export function hasSession(): boolean {
  return session !== null;
}

/** Subscribe to session changes; returns an unsubscribe function. */
export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
