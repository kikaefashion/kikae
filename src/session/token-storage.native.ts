import * as SecureStore from 'expo-secure-store';

import type { TokenStorage } from './token-storage';

const TOKEN_KEY = 'kikae.auth.token';

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
