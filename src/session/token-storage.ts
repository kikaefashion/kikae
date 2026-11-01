import * as SecureStore from 'expo-secure-store';

/** Platform-neutral token storage contract. */
export interface TokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  removeToken(): Promise<void>;
}

const TOKEN_KEY = 'kikae.auth.token';

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
};
