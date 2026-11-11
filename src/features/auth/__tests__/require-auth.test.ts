import type { Href } from 'expo-router';

import { requireAuth, resolveHeartAction } from '../require-auth';

describe('requireAuth', () => {
  it('returns the target for signed-in users', () => {
    expect(requireAuth('/cart' as Href, true, '/')).toBe('/cart');
  });

  it('redirects guests to login with the current path', () => {
    expect(requireAuth('/notifications' as Href, false, '/discover')).toBe(
      '/login?redirectTo=%2Fdiscover',
    );
  });
});

describe('resolveHeartAction', () => {
  it('waits while the session is hydrating', () => {
    expect(resolveHeartAction('loading')).toBe('wait');
  });

  it('redirects signed-out users and guests to login', () => {
    expect(resolveHeartAction('signedOut')).toBe('login');
  });

  it('proceeds for signed-in users', () => {
    expect(resolveHeartAction('signedIn')).toBe('proceed');
  });
});
