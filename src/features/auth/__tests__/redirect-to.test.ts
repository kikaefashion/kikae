import { sanitizeRedirectTo } from '../redirect-to';

describe('sanitizeRedirectTo', () => {
  it('keeps an internal path', () => {
    expect(sanitizeRedirectTo('/cart')).toBe('/cart');
  });

  it('rejects an absolute external URL', () => {
    expect(sanitizeRedirectTo('https://evil.example.com')).toBeUndefined();
  });

  it('rejects a protocol-relative URL', () => {
    expect(sanitizeRedirectTo('//evil.example.com')).toBeUndefined();
  });

  it('rejects a non-slash relative path', () => {
    expect(sanitizeRedirectTo('cart')).toBeUndefined();
  });

  it('returns undefined when omitted', () => {
    expect(sanitizeRedirectTo(undefined)).toBeUndefined();
  });
});
