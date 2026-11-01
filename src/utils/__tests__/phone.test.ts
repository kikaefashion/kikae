import { normalizeNigerianPhone } from '../phone';

describe('normalizeNigerianPhone', () => {
  it('accepts +234 international format', () => {
    expect(normalizeNigerianPhone('+2349038692680')).toBe('+2349038692680');
  });

  it('accepts a leading 0 and strips it', () => {
    expect(normalizeNigerianPhone('09038692680')).toBe('+2349038692680');
  });

  it('accepts a bare 234 country code', () => {
    expect(normalizeNigerianPhone('2349038692680')).toBe('+2349038692680');
  });

  it('strips spaces and dashes', () => {
    expect(normalizeNigerianPhone('+234 903 869 2680')).toBe('+2349038692680');
    expect(normalizeNigerianPhone('0903-869-2680')).toBe('+2349038692680');
  });

  it('returns null for invalid lengths', () => {
    expect(normalizeNigerianPhone('123')).toBeNull();
    expect(normalizeNigerianPhone('')).toBeNull();
    expect(normalizeNigerianPhone('09038692680123')).toBeNull();
  });
});
