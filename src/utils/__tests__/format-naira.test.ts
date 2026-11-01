import { formatNaira } from '../format-naira';

describe('formatNaira', () => {
  it('formats thousands with ₦ and no decimals', () => {
    expect(formatNaira(12500)).toBe('₦12,500');
    expect(formatNaira(0)).toBe('₦0');
    expect(formatNaira(1000000)).toBe('₦1,000,000');
  });

  it('rounds decimals away', () => {
    expect(formatNaira(1234.56)).toBe('₦1,235');
    expect(formatNaira(1999.4)).toBe('₦1,999');
  });

  it('treats non-finite input as zero', () => {
    expect(formatNaira(Number.NaN)).toBe('₦0');
    expect(formatNaira(Number.POSITIVE_INFINITY)).toBe('₦0');
  });
});
