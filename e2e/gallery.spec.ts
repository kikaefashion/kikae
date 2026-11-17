import { expect, test, type Page } from '@playwright/test';

import { mockBackend } from './support/backend';

async function openGallery(page: Page): Promise<void> {
  await mockBackend(page, 'success');
  await page.goto('/product/3');
  await expect(
    page.getByRole('heading', { name: 'Gallery dress' }),
  ).toBeVisible();
}

async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
}

test.describe('gallery desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('renders a 4:5 main frame and equal thumbnails with no horizontal overflow', async ({
    page,
  }) => {
    await openGallery(page);

    const frame = page.getByRole('img', {
      name: 'Gallery dress image 1 of 5',
    });
    const box = await frame.boundingBox();
    expect(box).not.toBeNull();
    const ratio = box!.width / box!.height;
    expect(ratio).toBeGreaterThan(0.79);
    expect(ratio).toBeLessThan(0.81);
    expect(box!.height).toBeLessThanOrEqual(900 * 0.8);

    const thumbs = page.getByRole('button', { name: /Show image \d of 5/ });
    await expect(thumbs).toHaveCount(5);

    const sizes = new Set<string>();
    for (let i = 0; i < 5; i += 1) {
      const b = await thumbs.nth(i).boundingBox();
      expect(b).not.toBeNull();
      sizes.add(`${b!.width}x${b!.height}`);
    }
    expect(sizes.size).toBe(1);

    await assertNoHorizontalOverflow(page);
  });
});

test.describe('gallery phone', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('renders a 4:5 main frame with no horizontal overflow', async ({
    page,
  }) => {
    await openGallery(page);

    const frame = page.getByRole('img', {
      name: 'Gallery dress image 1 of 5',
    });
    const box = await frame.boundingBox();
    expect(box).not.toBeNull();
    const ratio = box!.width / box!.height;
    expect(ratio).toBeGreaterThan(0.79);
    expect(ratio).toBeLessThan(0.81);
    expect(box!.height).toBeLessThanOrEqual(812 * 0.8);

    await assertNoHorizontalOverflow(page);
  });
});
