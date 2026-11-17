import { clearSession } from '@/api/identity';
import {
  fetchCurrentUser,
  type CurrentUser,
} from '@/api/endpoints/current-user';

import {
  endSession,
  getSessionStatus,
  getUserId,
  hasSession,
  hydrateSessionUser,
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
    getUserId: jest.fn(),
    setUserId: jest.fn(),
    removeUserId: jest.fn(),
  },
}));

jest.mock('@/api/endpoints/current-user', () => ({
  fetchCurrentUser: jest.fn(),
}));

const mockFetchCurrentUser = fetchCurrentUser as jest.MockedFunction<
  typeof fetchCurrentUser
>;

const mockGetToken = tokenStorage.getToken as jest.MockedFunction<
  typeof tokenStorage.getToken
>;
const mockSetToken = tokenStorage.setToken as jest.MockedFunction<
  typeof tokenStorage.setToken
>;
const mockRemoveToken = tokenStorage.removeToken as jest.MockedFunction<
  typeof tokenStorage.removeToken
>;
const mockGetUserId = tokenStorage.getUserId as jest.MockedFunction<
  typeof tokenStorage.getUserId
>;
const mockSetUserId = tokenStorage.setUserId as jest.MockedFunction<
  typeof tokenStorage.setUserId
>;
const mockRemoveUserId = tokenStorage.removeUserId as jest.MockedFunction<
  typeof tokenStorage.removeUserId
>;

beforeEach(() => {
  jest.clearAllMocks();
  clearSession();
  setGuest(false);
  mockGetUserId.mockResolvedValue(null);
});

describe('session-store', () => {
  it('restores a persisted token into memory', async () => {
    mockGetToken.mockResolvedValue('persisted-token');

    await restoreSession();

    expect(hasSession()).toBe(true);
  });

  it('restores the persisted user id alongside the token', async () => {
    mockGetToken.mockResolvedValue('persisted-token');
    mockGetUserId.mockResolvedValue(264);

    await restoreSession();

    expect(hasSession()).toBe(true);
    expect(getUserId()).toBe(264);
  });

  it('stays signed out when nothing is persisted', async () => {
    mockGetToken.mockResolvedValue(null);

    await restoreSession();

    expect(hasSession()).toBe(false);
  });

  it('persists a session and exposes the userId', async () => {
    await persistSession({ token: 't', userId: 42 });

    expect(mockSetToken).toHaveBeenCalledWith('t');
    expect(mockSetUserId).toHaveBeenCalledWith(42);
    expect(getUserId()).toBe(42);
    expect(hasSession()).toBe(true);
  });

  it('does not persist a null user id', async () => {
    await persistSession({ token: 't', userId: null });

    expect(mockSetUserId).not.toHaveBeenCalled();
  });

  it('ends the session and clears storage', async () => {
    await persistSession({ token: 't', userId: 42 });

    await endSession();

    expect(mockRemoveToken).toHaveBeenCalled();
    expect(mockRemoveUserId).toHaveBeenCalled();
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
    expect(mockSetUserId).toHaveBeenCalledWith(7);
  });

  it('hydrates the user id when a token exists without a stored id', async () => {
    await persistSession({ token: 't', userId: null });
    mockFetchCurrentUser.mockResolvedValue({ id: 264 } as CurrentUser);

    await expect(hydrateSessionUser()).resolves.toBe(true);

    expect(getUserId()).toBe(264);
  });

  it('leaves the user id null when hydration fails', async () => {
    await persistSession({ token: 't', userId: null });
    mockFetchCurrentUser.mockRejectedValue(new Error('offline'));

    await expect(hydrateSessionUser()).resolves.toBe(false);

    expect(getUserId()).toBeNull();
  });

  it('skips hydration when the user id is already known', async () => {
    await persistSession({ token: 't', userId: 42 });

    await expect(hydrateSessionUser()).resolves.toBe(true);

    expect(mockFetchCurrentUser).not.toHaveBeenCalled();
  });
});
