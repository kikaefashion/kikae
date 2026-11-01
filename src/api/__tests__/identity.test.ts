import {
  clearSession,
  getAuthToken,
  getUserId,
  hasSession,
  setSession,
  subscribeSession,
} from '../identity';

describe('identity', () => {
  afterEach(() => {
    clearSession();
  });

  it('sets and gets the session', () => {
    setSession({ token: 't', userId: 7 });

    expect(getAuthToken()).toBe('t');
    expect(getUserId()).toBe(7);
    expect(hasSession()).toBe(true);
  });

  it('clears the session', () => {
    setSession({ token: 't', userId: 7 });

    clearSession();

    expect(hasSession()).toBe(false);
    expect(getAuthToken()).toBeNull();
    expect(getUserId()).toBeNull();
  });

  it('notifies subscribers on change and unsubscribes', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeSession(listener);

    setSession({ token: 't', userId: 1 });
    expect(listener).toHaveBeenCalledTimes(1);

    clearSession();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    setSession({ token: 't2', userId: 2 });
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
