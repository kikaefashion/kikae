import { productDetail } from '@/test-utils/msw/handlers';

import { averageRating, isProductLiked, stockLabel } from '../selectors';

describe('product selectors', () => {
  it('derives liked state from likes[]', () => {
    const product = { ...productDetail, likes: [{ user_id: 7, like: 1 }] };
    expect(isProductLiked(product, 7)).toBe(true);
    expect(isProductLiked(product, 8)).toBe(false);
    expect(isProductLiked(product, null)).toBe(false);
  });

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
