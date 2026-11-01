import { normalizeOrderStatus } from '../order-status';

describe('normalizeOrderStatus', () => {
  it('normalizes the "Order placed" DB default to order_placed', () => {
    expect(normalizeOrderStatus('Order placed')).toBe('order_placed');
  });

  it('lowercases, trims and replaces spaces with underscores', () => {
    expect(normalizeOrderStatus('  Ready For Delivery ')).toBe(
      'ready_for_delivery',
    );
    expect(normalizeOrderStatus('SERVICE_BOOKED')).toBe('service_booked');
  });

  it('passes known snake_case values through', () => {
    expect(normalizeOrderStatus('settled')).toBe('settled');
    expect(normalizeOrderStatus('dispatched')).toBe('dispatched');
  });

  it('maps unknown values to unknown', () => {
    expect(normalizeOrderStatus('weird-status')).toBe('unknown');
    expect(normalizeOrderStatus('')).toBe('unknown');
  });
});
