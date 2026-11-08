import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guard rails for the design system: no hardcoded hex colors and no Tailwind
 * arbitrary values may live outside `src/theme` (single source of truth).
 */
const SRC = join(process.cwd(), 'src');

// Legacy starter files that still carry hardcoded colors. They are replaced by
// the token-driven components and will be deleted; remove these exclusions
// when the starter template is gone.
const LEGACY = new Set([join(SRC, 'components', 'animated-icon.tsx')]);

function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (full === join(SRC, 'theme') || entry === '__tests__') return [];
      return collectSourceFiles(full);
    }
    if (!/\.(ts|tsx)$/.test(entry) || entry.endsWith('.d.ts')) return [];
    if (LEGACY.has(full)) return [];
    return [full];
  });
}

const files = collectSourceFiles(SRC);

// The Text component is the single place that resolves font families/weights
// from the tokens; everything else must use `<Text>` (or the tokens) instead.
const TEXT_COMPONENT = join(SRC, 'components', 'ui', 'text.tsx');
const fontRuleFiles = files.filter((file) => file !== TEXT_COMPONENT);

const HEX =
  /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
// Tailwind arbitrary values always take the form `utility-[value]`.
const ARBITRARY = /-\[[^\]]+\]/;
const FONT_FAMILY = /\bfontFamily\s*:/;
const FONT_WEIGHT = /\bfontWeight\s*:/;
const FONT_CLASS = /\bfont-[a-z][a-z0-9-]*\b/;

describe('design rules', () => {
  it('has source files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)('follows token rules: %s', (file) => {
    const content = readFileSync(file, 'utf8');
    expect(content).not.toMatch(HEX);
    expect(content).not.toMatch(ARBITRARY);
  });

  it.each(fontRuleFiles)(
    'does not hardcode font families or weights: %s',
    (file) => {
      const content = readFileSync(file, 'utf8');
      expect(content).not.toMatch(FONT_FAMILY);
      expect(content).not.toMatch(FONT_WEIGHT);
      expect(content).not.toMatch(FONT_CLASS);
    },
  );
});
