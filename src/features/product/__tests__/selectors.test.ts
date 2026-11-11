import { averageRating, stockLabel } from '../selectors';

describe('product selectors', () => {
  it('labels stock', () => {
    expect(stockLabel(0)).toBe('Sold out');
    expect(stockLabel(1)).toBe('Only 1 left');
    expect(stockLabel(3)).toBe('Only 3 left');
    expect(stockLabel(4)).toBeNull();
  });

  it('averages ratings and never returns NaN', () => {
    expect(averageRating([{ rating: 4 }, { rating: 5 }])).toBe(5);
    expect(averageRating([])).toBeNull();
  });
});
