import { clearSession } from '@/api/identity';

import {
  endSession,
  getUserId,
  hasSession,
  persistSession,
  restoreSession,
} from '../session-store';
import { tokenStorage } from '../token-storage';

jest.mock('../token-storage', () => ({
  tokenStorage: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn(),
  },
}));

const mockGetToken = tokenStorage.getToken as jest.MockedFunction<
  typeof tokenStorage.getToken
>;
const mockSetToken = tokenStorage.setToken as jest.MockedFunction<
  typeof tokenStorage.setToken
>;
const mockRemoveToken = tokenStorage.removeToken as jest.MockedFunction<
  typeof tokenStorage.removeToken
>;

beforeEach(() => {
  jest.clearAllMocks();
  clearSession();
});

describe('session-store', () => {
  it('restores a persisted token into memory', async () => {
    mockGetToken.mockResolvedValue('persisted-token');

    await restoreSession();

    expect(hasSession()).toBe(true);
  });

  it('stays signed out when nothing is persisted', async () => {
    mockGetToken.mockResolvedValue(null);

    await restoreSession();

    expect(hasSession()).toBe(false);
  });

  it('persists a session and exposes the userId', async () => {
    await persistSession({ token: 't', userId: 42 });

    expect(mockSetToken).toHaveBeenCalledWith('t');
    expect(getUserId()).toBe(42);
    expect(hasSession()).toBe(true);
  });

  it('ends the session and clears storage', async () => {
    await persistSession({ token: 't', userId: 42 });

    await endSession();

    expect(mockRemoveToken).toHaveBeenCalled();
    expect(hasSession()).toBe(false);
    expect(getUserId()).toBeNull();
  });
});
