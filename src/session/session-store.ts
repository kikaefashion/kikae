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

/** Loads the persisted token into memory (userId is null until `/currentUser`). */
export async function restoreSession(): Promise<void> {
  const token = await tokenStorage.getToken();
  if (token) {
    setSession({ token, userId: null });
  }
}

export async function persistSession(session: Session): Promise<void> {
  await tokenStorage.setToken(session.token);
  setSession(session);
}

export async function endSession(): Promise<void> {
  await tokenStorage.removeToken();
  clearSession();
}

export function subscribe(listener: () => void): () => void {
  return subscribeSession(listener);
}

export { getAuthToken, getUserId, hasSession };
