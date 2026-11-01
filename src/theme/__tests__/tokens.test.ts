import { cssVarName, gray, iconSizes, radii, spacing, type } from '../tokens';

describe('design tokens', () => {
  it('maps token keys to --kikae-* CSS variable names', () => {
    expect(cssVarName('canvas')).toBe('--kikae-canvas');
    expect(cssVarName('surface-overlay')).toBe('--kikae-surface-overlay');
  });

  it('has the documented neutral gray scale (11 steps)', () => {
    expect(Object.keys(gray)).toHaveLength(11);
    expect(gray[50]).toBe('#FAFAFA');
    expect(gray[950]).toBe('#0A0A0A');
  });

  it('has the documented spacing scale', () => {
    expect(spacing).toEqual([
      0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96,
    ]);
  });

  it('has the documented radii', () => {
    expect(radii).toEqual({
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      '2xl': 32,
      full: 9999,
    });
  });

  it('has the documented icon sizes', () => {
    expect(iconSizes).toEqual([16, 20, 24, 28, 32]);
  });

  it('every type token has size, line-height and weight', () => {
    for (const spec of Object.values(type)) {
      expect(spec.size).toBeGreaterThan(0);
      expect(spec.lineHeight).toBeGreaterThan(0);
      expect([400, 500, 700]).toContain(spec.weight);
    }
  });
});
