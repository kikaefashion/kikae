import * as SecureStore from 'expo-secure-store';

import { tokenStorage } from '../token-storage';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('token-storage (native)', () => {
  it('reads, writes and clears the token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('stored-token');

    await expect(tokenStorage.getToken()).resolves.toBe('stored-token');

    await tokenStorage.setToken('new-token');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'kikae.auth.token',
      'new-token',
    );

    await tokenStorage.removeToken();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      'kikae.auth.token',
    );
  });

  it('reads, writes and clears the user id', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('264');

    await expect(tokenStorage.getUserId()).resolves.toBe(264);

    await tokenStorage.setUserId(42);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'kikae.auth.userId',
      '42',
    );

    await tokenStorage.removeUserId();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      'kikae.auth.userId',
    );
  });

  it('returns null for a missing user id', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    await expect(tokenStorage.getUserId()).resolves.toBeNull();
  });
});
