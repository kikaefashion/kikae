import * as SecureStore from 'expo-secure-store';

/** Platform-neutral token storage contract. */
export interface TokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  removeToken(): Promise<void>;
  /** Persisted user id (null when absent) so a restored token also restores identity. */
  getUserId(): Promise<string | number | null>;
  setUserId(userId: string | number): Promise<void>;
  removeUserId(): Promise<void>;
}

const TOKEN_KEY = 'kikae.auth.token';
const USER_ID_KEY = 'kikae.auth.userId';

/**
 * Native/default implementation backed by expo-secure-store. On web, Metro
 * resolves `token-storage.web.ts` (localStorage) instead of this file.
 */
export const tokenStorage: TokenStorage = {
  async getToken() {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async setToken(token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async removeToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
  async getUserId() {
    const raw = await SecureStore.getItemAsync(USER_ID_KEY);
    if (raw === null) return null;
    return /^\d+$/.test(raw) ? Number(raw) : raw;
  },
  async setUserId(userId) {
    await SecureStore.setItemAsync(USER_ID_KEY, String(userId));
  },
  async removeUserId() {
    await SecureStore.deleteItemAsync(USER_ID_KEY);
  },
};
