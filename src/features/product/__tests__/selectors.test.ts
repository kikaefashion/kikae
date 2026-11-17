import type { CartLine } from '@/api/endpoints/cart';

import {
  averageRating,
  buyNowPath,
  planAddToCart,
  remainingStockForProduct,
  stockLabel,
  unitsInCartForProduct,
} from '../selectors';

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    id: 1,
    units: 1,
    size_id: 425,
    color_id: 476,
    isCustom: '0',
    available_id: null,
    product: {
      id: 243,
      name: 'Hoodie',
      price: 20000,
      old_price: 27000,
      units: 10,
      status: 'approved',
      isMakeup: false,
      thrift: false,
      media: [],
      sizes: [],
      colours: [],
    },
    ...overrides,
  };
}

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

describe('planAddToCart', () => {
  it('merges a repeated product/size/colour into the existing line', () => {
    const existing = line({ id: 7, units: 2 });
    const plan = planAddToCart([existing], { id: 243, units: 10 }, 425, 476, 3);
    expect(plan).toEqual({ kind: 'update', lineId: 7, units: 5 });
  });

  it('clamps the merge counting the SUM of units across all lines', () => {
    const matching = line({ id: 1, units: 2, size_id: 425 });
    const other = line({ id: 2, units: 2, size_id: 424 });
    // Stock 6, 4 already in the cart → only 2 more fit on the matching line.
    const plan = planAddToCart(
      [matching, other],
      { id: 243, units: 6 },
      425,
      476,
      3,
    );
    expect(plan).toEqual({ kind: 'update', lineId: 1, units: 4 });
  });

  it('returns full when the cart already holds the whole stock', () => {
    const a = line({ id: 1, units: 4, size_id: 425 });
    const b = line({ id: 2, units: 4, size_id: 424 });
    expect(planAddToCart([a, b], { id: 243, units: 6 }, 425, 476, 5)).toEqual({
      kind: 'full',
    });
  });

  it('adds a new line when there is no matching size/colour', () => {
    expect(planAddToCart([], { id: 243, units: 10 }, 425, 476, 3)).toEqual({
      kind: 'add',
      units: 3,
    });
  });

  it('ignores old-app and makeup lines when clamping', () => {
    const custom = line({ id: 9, isCustom: '1', units: 50 });
    const makeup = line({
      id: 10,
      product: { ...line().product, isMakeup: true },
    });
    const plan = planAddToCart([custom, makeup], { id: 243, units: 10 }, 425, 476, 3);
    expect(plan).toEqual({ kind: 'add', units: 3 });
  });
});

describe('cart unit counts', () => {
  it('counts only purchasable lines', () => {
    const cart = [
      line({ id: 1, units: 2 }),
      line({ id: 2, units: 3, isCustom: '1' }),
      line({ id: 3, units: 1, product: { ...line().product, isMakeup: true } }),
    ];
    expect(unitsInCartForProduct(cart, 243)).toBe(2);
    expect(remainingStockForProduct(cart, 243, 5)).toBe(3);
  });
});

describe('buyNowPath', () => {
  it('uses ids only, never prices or totals', () => {
    expect(buyNowPath(243, 425, 476)).toBe(
      '/checkout?mode=buyNow&product=243&size=425&color=476&units=1',
    );
  });

  it('falls back to 0 when nothing is selected', () => {
    expect(buyNowPath(243, null, null)).toBe(
      '/checkout?mode=buyNow&product=243&size=0&color=0&units=1',
    );
  });
});
