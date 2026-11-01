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

  it('accepts the backend comma-separated format', () => {
    expect(normalizeNigerianPhone('234,8000000000')).toBe('+2348000000000');
    expect(normalizeNigerianPhone('2348000000000')).toBe('+2348000000000');
  });

  it('returns null for invalid lengths', () => {
    expect(normalizeNigerianPhone('123')).toBeNull();
    expect(normalizeNigerianPhone('')).toBeNull();
    expect(normalizeNigerianPhone('09038692680123')).toBeNull();
  });
});
