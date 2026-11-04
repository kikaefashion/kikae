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

  it('keeps the five main tabs inside a (tabs) group', () => {
    expect(existsSync(join(APP, '(tabs)', '_layout.tsx'))).toBe(true);
    for (const route of ['index', 'discover', 'runway', 'makeup', 'profile']) {
      expect(existsSync(join(APP, '(tabs)', `${route}.tsx`))).toBe(true);
    }
  });

  it('keeps cart and notifications as standalone routes', () => {
    expect(existsSync(join(APP, 'cart.tsx'))).toBe(true);
    expect(existsSync(join(APP, 'notifications.tsx'))).toBe(true);
  });

  it('keeps design-system dev-only and redirects in production', () => {
    const screen = readFileSync(join(APP, 'design-system.tsx'), 'utf8');
    expect(screen).toMatch(/__DEV__/);
    expect(screen).toMatch(/Redirect/);
  });
});
