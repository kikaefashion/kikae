import { getNavEntries } from '../nav-config';

describe('getNavEntries', () => {
  it('always returns the five primary tabs', () => {
    const entries = getNavEntries(true);

    expect(entries.map((entry) => entry.name)).toEqual([
      'index',
      'discover',
      'runway',
      'makeup',
      'profile',
    ]);
    expect(entries.map((entry) => entry.label)).toEqual([
      'Home',
      'Discover',
      'Runway',
      'Makeup',
      'Profile',
    ]);
  });

  it('labels Profile as "Sign in" for guests', () => {
    const profile = getNavEntries(false).find(
      (entry) => entry.name === 'profile',
    );
    expect(profile?.label).toBe('Sign in');
  });
});
