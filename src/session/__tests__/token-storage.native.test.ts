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
});
