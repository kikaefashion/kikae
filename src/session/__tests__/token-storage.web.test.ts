import { tokenStorage } from '../token-storage.web';

type StorageMock = {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
};

const TOKEN_KEY = 'kikae.auth.token';
const USER_ID_KEY = 'kikae.auth.userId';

const mutableGlobal = globalThis as unknown as { window?: unknown };

let storage: StorageMock;

function installWindow(): void {
  storage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  mutableGlobal.window = { localStorage: storage };
}

function uninstallWindow(): void {
  delete mutableGlobal.window;
}

describe('token-storage (web)', () => {
  afterEach(uninstallWindow);

  describe('without window (SSR)', () => {
    beforeEach(uninstallWindow);

    it('no-ops and returns null when window is unavailable', async () => {
      await expect(tokenStorage.getToken()).resolves.toBeNull();
      await expect(tokenStorage.getUserId()).resolves.toBeNull();
      await expect(tokenStorage.setToken('t')).resolves.toBeUndefined();
      await expect(tokenStorage.removeToken()).resolves.toBeUndefined();
      await expect(tokenStorage.setUserId(1)).resolves.toBeUndefined();
      await expect(tokenStorage.removeUserId()).resolves.toBeUndefined();
    });
  });

  describe('with localStorage', () => {
    beforeEach(installWindow);

    it('reads, writes and clears the token', async () => {
      storage.getItem.mockReturnValue('stored-token');

      await expect(tokenStorage.getToken()).resolves.toBe('stored-token');
      expect(storage.getItem).toHaveBeenCalledWith(TOKEN_KEY);

      await tokenStorage.setToken('new-token');
      expect(storage.setItem).toHaveBeenCalledWith(TOKEN_KEY, 'new-token');

      await tokenStorage.removeToken();
      expect(storage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('coerces a numeric user id and passes through a non-numeric one', async () => {
      storage.getItem.mockReturnValue('264');
      await expect(tokenStorage.getUserId()).resolves.toBe(264);

      storage.getItem.mockReturnValue('vendor-7');
      await expect(tokenStorage.getUserId()).resolves.toBe('vendor-7');
    });

    it('returns null for a missing user id', async () => {
      storage.getItem.mockReturnValue(null);
      await expect(tokenStorage.getUserId()).resolves.toBeNull();
    });

    it('writes and clears the user id', async () => {
      await tokenStorage.setUserId(42);
      expect(storage.setItem).toHaveBeenCalledWith(USER_ID_KEY, '42');

      await tokenStorage.removeUserId();
      expect(storage.removeItem).toHaveBeenCalledWith(USER_ID_KEY);
    });
  });
});
