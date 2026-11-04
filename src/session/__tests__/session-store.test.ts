import { clearSession } from '@/api/identity';

import {
  endSession,
  getSessionStatus,
  getUserId,
  hasSession,
  isGuest,
  persistSession,
  restoreSession,
  setGuest,
  setSessionUserId,
  subscribe,
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
  setGuest(false);
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

  it('transitions to signedIn when a token is restored', async () => {
    mockGetToken.mockResolvedValue('persisted-token');

    await restoreSession();

    expect(getSessionStatus()).toBe('signedIn');
  });

  it('transitions to signedOut when nothing is persisted', async () => {
    mockGetToken.mockResolvedValue(null);

    await restoreSession();

    expect(getSessionStatus()).toBe('signedOut');
  });

  it('transitions to signedOut on endSession', async () => {
    await persistSession({ token: 't', userId: 42 });

    await endSession();

    expect(getSessionStatus()).toBe('signedOut');
  });

  it('notifies subscribers when the status changes', async () => {
    const listener = jest.fn();
    const unsubscribe = subscribe(listener);

    await persistSession({ token: 't', userId: 42 });

    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it('sets and reads the guest flag', () => {
    expect(isGuest()).toBe(false);
    setGuest(true);
    expect(isGuest()).toBe(true);
  });

  it('notifies subscribers when the guest flag changes', () => {
    const listener = jest.fn();
    const unsubscribe = subscribe(listener);

    setGuest(true);

    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });

  it('clears the guest flag on sign-in', async () => {
    setGuest(true);

    await persistSession({ token: 't', userId: 42 });

    expect(isGuest()).toBe(false);
  });

  it('clears the guest flag on sign-out', async () => {
    setGuest(true);

    await endSession();

    expect(isGuest()).toBe(false);
  });

  it('stores the userId once the token exists', async () => {
    await persistSession({ token: 't', userId: null });

    setSessionUserId(7);

    expect(getUserId()).toBe(7);
  });
});
