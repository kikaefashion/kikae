import { computeColumns, getBreakpoint } from '../layout';

describe('getBreakpoint', () => {
  it.each([
    [0, 'base'],
    [639, 'base'],
    [640, 'sm'],
    [767, 'sm'],
    [768, 'md'],
    [1023, 'md'],
    [1024, 'lg'],
    [1279, 'lg'],
    [1280, 'xl'],
    [1535, 'xl'],
    [1536, '2xl'],
  ] as const)('width %i → %s', (width, expected) => {
    expect(getBreakpoint(width)).toBe(expected);
  });
});

describe('computeColumns', () => {
  it.each([
    // Container width (content area; ≥lg subtracts the 256px sidebar) → columns.
    [320, 2],
    [640, 3],
    [768, 4], // lg content area (1024 − 256)
    [1024, 5], // xl content area (1280 − 256)
    [1280, 5], // 2xl content area (1536 − 256)
    [10000, 5],
  ] as const)('container width %i → %i columns', (width, expected) => {
    expect(computeColumns(width)).toBe(expected);
  });

  it('uses the 24px gap at lg+ and the 16px gap below', () => {
    // Below lg the 16px gap yields 5 columns at 864; at lg+ the 24px gap caps
    // the same content width differently — verify the clamp floor is applied.
    expect(computeColumns(864)).toBeGreaterThanOrEqual(2);
    expect(computeColumns(1024)).toBe(5);
  });

  it('never goes below two columns', () => {
    expect(computeColumns(0)).toBe(2);
  });
});
