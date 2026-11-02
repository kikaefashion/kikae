import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const APP = join(process.cwd(), 'src', 'app');

describe('routing structure', () => {
  it('uses a root Stack that declares design-system and the tabs group', () => {
    const layout = readFileSync(join(APP, '_layout.tsx'), 'utf8');
    expect(layout).toMatch(/<Stack/);
    expect(layout).toMatch(/name="design-system"/);
    expect(layout).toMatch(/name="\(tabs\)"/);
  });

  it('keeps the main tabs inside a (tabs) group', () => {
    expect(existsSync(join(APP, '(tabs)', '_layout.tsx'))).toBe(true);
    expect(existsSync(join(APP, '(tabs)', 'index.tsx'))).toBe(true);
    expect(existsSync(join(APP, '(tabs)', 'explore.tsx'))).toBe(true);
  });

  it('keeps design-system dev-only and redirects in production', () => {
    const screen = readFileSync(join(APP, 'design-system.tsx'), 'utf8');
    expect(screen).toMatch(/__DEV__/);
    expect(screen).toMatch(/Redirect/);
  });
});
