import type { Href } from 'expo-router';

import { requireAuth } from '../require-auth';

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
