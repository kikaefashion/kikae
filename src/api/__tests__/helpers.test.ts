import { bool, dateOnly, dateTime, id, money } from '../helpers';

describe('Zod API helpers', () => {
  it('bool coerces 0/1 (int or string), null and booleans', () => {
    expect(bool.parse(true)).toBe(true);
    expect(bool.parse(false)).toBe(false);
    expect(bool.parse(1)).toBe(true);
    expect(bool.parse(0)).toBe(false);
    expect(bool.parse('1')).toBe(true);
    expect(bool.parse('0')).toBe(false);
    expect(bool.parse(null)).toBe(false);
  });

  it('money coerces numeric strings to numbers and rejects non-numeric', () => {
    expect(money.parse(1250)).toBe(1250);
    expect(money.parse('1250.50')).toBe(1250.5);
    expect(() => money.parse('abc')).toThrow();
  });

  it('id accepts number or string and rejects other types', () => {
    expect(id.parse(1)).toBe(1);
    expect(id.parse('550e8400-e29b-41d4-a716-446655440000')).toBe(
      '550e8400-e29b-41d4-a716-446655440000',
    );
    expect(() => id.parse(true)).toThrow();
  });

  it('dateTime accepts both UTC Z and offset timestamps', () => {
    expect(dateTime.parse('2024-01-07T12:00:00.000Z')).toBe(
      '2024-01-07T12:00:00.000Z',
    );
    expect(dateTime.parse('2024-01-07T12:00:00.000+01:00')).toBe(
      '2024-01-07T12:00:00.000+01:00',
    );
    expect(() => dateTime.parse('not-a-date')).toThrow();
  });

  it('dateOnly normalizes the unset sentinel and null to null', () => {
    expect(dateOnly.parse('1990-05-20')).toBe('1990-05-20');
    expect(dateOnly.parse('1970-01-01')).toBeNull();
    expect(dateOnly.parse(null)).toBeNull();
    expect(() => dateOnly.parse('not-a-date')).toThrow();
  });
});
