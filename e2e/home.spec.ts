import { expect, test, type Page } from '@playwright/test';

import { mockBackend } from './support/backend';

const guestButton = (page: Page) =>
  page.getByRole('button', { name: 'Continue as guest', exact: true });

/** Enters guest browsing and waits for the Home feed to load. */
async function openHomeAsGuest(page: Page): Promise<void> {
  await mockBackend(page, 'success');
  await page.goto('/login');
  await guestButton(page).click();
  await expect(
    page.getByRole('tab', { name: 'Home', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Ankara dress').first()).toBeVisible();
  // The banner carousel renders from the second (banners) request.
  await expect(page.getByText('View Makeup services').first()).toBeVisible();
}

test.describe('home', () => {
  test('home loads and a card tap opens the product detail', async ({
    page,
  }) => {
    await openHomeAsGuest(page);

    await page.getByText('Ankara dress').first().click();

    await expect(page).toHaveURL(/\/product\/1/);
    await expect(
      page.getByRole('heading', { name: 'Ankara dress' }),
    ).toBeVisible();
  });

  test('a guest tapping the heart reaches /login', async ({ page }) => {
    await openHomeAsGuest(page);

    await page.getByRole('button', { name: 'Add to wishlist' }).first().click();

    await expect(page).toHaveURL(/\/login/);
  });
});
