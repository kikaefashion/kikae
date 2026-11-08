import { APP_TITLE, formatDocumentTitle, PAGE_TITLES } from '../titles';

describe('document titles', () => {
  it('suffixes a page title with the app name', () => {
    expect(formatDocumentTitle('Log in')).toBe('Log in | Kikae');
    expect(formatDocumentTitle('Home')).toBe('Home | Kikae');
  });

  it('falls back to the app name when no page title is given', () => {
    expect(formatDocumentTitle()).toBe('Kikae');
    expect(formatDocumentTitle(undefined)).toBe('Kikae');
    expect(formatDocumentTitle('')).toBe('Kikae');
  });

  it('keeps the app title in sync with the fallback', () => {
    expect(APP_TITLE).toBe('Kikae');
    expect(formatDocumentTitle(undefined)).toBe(APP_TITLE);
  });

  it('centralizes every per-route page title', () => {
    expect(PAGE_TITLES).toEqual({
      login: 'Log in',
      home: 'Home',
      discover: 'Discover',
      runway: 'Runway',
      makeup: 'Makeup',
      profile: 'Profile',
      cart: 'Cart',
      notifications: 'Notifications',
      stores: 'Stores',
      freebies: 'Freebies',
      designSystem: 'Design system',
    });
  });
});
