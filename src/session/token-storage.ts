/** Platform-neutral token storage contract. */
export interface TokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  removeToken(): Promise<void>;
}

const TOKEN_KEY = 'kikae.auth.token';

/**
 * Web/default implementation backed by `localStorage`. On native, Metro
 * resolves `token-storage.native.ts` (expo-secure-store) instead.
 *
 * SECURITY TRADE-OFF: localStorage is readable by any script on the page, so a
 * successful XSS attack can exfiltrate the token. An HttpOnly cookie would be
 * safer but requires backend support — tracked in `docs/design/backlog.md`.
 * Accepted for the rebuild.
 */
export const tokenStorage: TokenStorage = {
  async getToken() {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.localStorage.getItem(TOKEN_KEY);
  },
  async setToken(token) {
    // Guard for static/server rendering where `window` is unavailable.
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  async removeToken() {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.removeItem(TOKEN_KEY);
  },
};
