import { expect, test, type Page } from '@playwright/test';

import { mockBackend } from './support/backend';

const email = (page: Page) => page.getByLabel('Email', { exact: true });

test.describe('fonts', () => {
  test('Poppins loads on /login', async ({ page }) => {
    await mockBackend(page, 'success');
    await page.goto('/login');
    await expect(email(page)).toBeVisible();

    await page.waitForFunction(() =>
      document.fonts.check('16px "Poppins_400Regular"'),
    );
  });

  test('the naira sign resolves on /login', async ({ page }) => {
    await mockBackend(page, 'success');
    await page.goto('/login');
    await expect(email(page)).toBeVisible();

    // Poppins has no ₦ (U+20A6); the fallback stack must still render a glyph.
    const width = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return 0;
      context.font = '32px "Poppins_400Regular"';
      return context.measureText('₦').width;
    });

    expect(width).toBeGreaterThan(0);
  });
});
