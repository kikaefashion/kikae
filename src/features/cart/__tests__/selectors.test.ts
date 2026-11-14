import type { CartLine } from '@/api/endpoints/cart';

import {
  cartSubtotal,
  cartUnits,
  checkoutIds,
  isAvailableLine,
  lineExclusion,
  unitsAvailableForLine,
} from '../selectors';

function line(
  id: number,
  productId: number,
  options: {
    units?: number;
    isCustom?: string;
    isMakeup?: boolean;
    price?: number;
    status?: string;
    stock?: number;
  } = {},
): CartLine {
  return {
    id,
    units: options.units ?? 1,
    size_id: null,
    color_id: null,
    isCustom: options.isCustom ?? '0',
    available_id: null,
    product: {
      id: productId,
      name: `Product ${productId}`,
      price: options.price ?? 1000,
      old_price: null,
      units: options.stock ?? 5,
      status: options.status ?? 'approved',
      isMakeup: options.isMakeup ?? false,
      thrift: false,
      media: [],
      sizes: [],
      colours: [],
    },
  };
}

describe('cart selectors', () => {
  it('treats only purchasable lines as available', () => {
    expect(isAvailableLine(line(1, 10))).toBe(true);
    expect(isAvailableLine(line(2, 10, { isCustom: '1' }))).toBe(false);
    expect(isAvailableLine(line(3, 10, { isMakeup: true }))).toBe(false);
    expect(isAvailableLine(line(4, 10, { price: 0 }))).toBe(false);
    expect(isAvailableLine(line(5, 10, { status: 'rejected' }))).toBe(false);
    expect(isAvailableLine(line(6, 10, { stock: 0 }))).toBe(false);
  });

  it('excludes unavailable, out-of-stock, custom, makeup and free lines from checkout ids', () => {
    const cart = [
      line(1, 10),
      line(2, 10, { isCustom: '1' }),
      line(3, 11, { isMakeup: true }),
      line(4, 12, { price: 0 }),
      line(5, 13, { status: 'rejected' }),
      line(6, 14, { stock: 0 }),
      line(7, 15),
    ];

    expect(checkoutIds(cart)).toEqual([1, 7]);
  });

  it('derives the TopBar badge from units of available lines only', () => {
    const cart = [
      line(1, 10, { units: 3 }),
      line(2, 10, { units: 2, price: 0 }),
      line(3, 11, { units: 4, isMakeup: true }),
      line(4, 12, { units: 1 }),
    ];

    expect(cartUnits(cart)).toBe(4);
  });

  it('clamps a line across duplicate lines of the same product', () => {
    const cart = [
      line(1, 10, { units: 3, stock: 10 }),
      line(2, 10, { units: 2, stock: 10 }),
    ];

    // Each line can only grow to stock minus the other line's units.
    expect(unitsAvailableForLine(cart, cart[0])).toBe(8);
    expect(unitsAvailableForLine(cart, cart[1])).toBe(7);
  });

  it('sums the estimated subtotal of available lines only', () => {
    const cart = [
      line(1, 10, { units: 2, price: 1000 }),
      line(2, 11, { units: 1, price: 0 }),
      line(3, 12, { units: 3, price: 500 }),
    ];

    expect(cartSubtotal(cart)).toBe(3500);
  });

  it('maps a free line to the free reason and everything else to not-available', () => {
    expect(lineExclusion(line(1, 10))).toBeNull();
    expect(lineExclusion(line(2, 10, { price: 0 }))).toBe('free');
    expect(lineExclusion(line(3, 10, { status: 'rejected' }))).toBe(
      'not-available',
    );
  });
});
