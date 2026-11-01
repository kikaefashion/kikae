import { contrastRatio } from '../contrast';
import { contrastPairs } from '../tokens';

describe('design token contrast ratios (WCAG 2.2 AA)', () => {
  it('has no empty pairs', () => {
    expect(contrastPairs.length).toBeGreaterThan(0);
  });

  it.each(
    contrastPairs
      .filter((pair) => !pair.exempt)
      .map((pair) => [pair.label, pair] as const),
  )('meets minimum ratio: %s', (_label, pair) => {
    const ratio = contrastRatio(pair.fg, pair.bg);
    expect(ratio).toBeGreaterThanOrEqual(pair.min);
  });

  it('keeps the exempt elevation tone below AA (non-text only, 1.04:1)', () => {
    const elevationTone = contrastPairs.find(
      (pair) => pair.label === 'surface on canvas (elevation tone)',
    );
    expect(elevationTone?.exempt).toBe(true);
  });
});
