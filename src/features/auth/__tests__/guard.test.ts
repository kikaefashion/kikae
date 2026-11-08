import { resolveGuards } from '../guard';

describe('resolveGuards', () => {
  it('routes signed-out non-guests to login', () => {
    expect(resolveGuards('signedOut', false)).toEqual({
      tabs: false,
      auth: true,
    });
  });

  it('keeps signed-in users on tabs', () => {
    expect(resolveGuards('signedIn', false)).toEqual({
      tabs: true,
      auth: false,
    });
  });

  it('keeps guests on tabs and lets them open login', () => {
    expect(resolveGuards('signedOut', true)).toEqual({
      tabs: true,
      auth: true,
    });
  });

  it('keeps tabs open while the session is loading', () => {
    expect(resolveGuards('loading', false)).toEqual({
      tabs: true,
      auth: false,
    });
  });
});
