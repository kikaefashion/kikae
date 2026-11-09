import { expect, test, type Page } from '@playwright/test';

import { mockBackend } from './support/backend';

const guestButton = (page: Page) =>
  page.getByRole('button', { name: 'Continue as guest', exact: true });

async function openHomeAsGuest(page: Page): Promise<void> {
  await mockBackend(page, 'success');
  await page.goto('/login');
  await guestButton(page).click();
  await expect(
    page.getByRole('tab', { name: 'Home', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Ankara dress').first()).toBeVisible();
}

test.describe('product detail', () => {
  test('a Home card tap renders the product name', async ({ page }) => {
    await openHomeAsGuest(page);

    await page.getByText('Ankara dress').first().click();

    await expect(page).toHaveURL(/\/product\/1/);
    await expect(page.getByText('Ankara dress').first()).toBeVisible();
    await expect(page.getByText('Ada Threads')).toBeVisible();
  });

  test('an unknown id shows not-found', async ({ page }) => {
    await mockBackend(page, 'success');
    await page.goto('/product/999');

    await expect(page.getByText('Product unavailable')).toBeVisible();
    await expect(page.getByText("This product can't be found.")).toBeVisible();
  });

  test('a guest heart tap reaches /login', async ({ page }) => {
    await openHomeAsGuest(page);
    await page.getByText('Ankara dress').first().click();
    await expect(page).toHaveURL(/\/product\/1/);

    await page.getByRole('button', { name: 'Add to wishlist' }).click();

    await expect(page).toHaveURL(/\/login/);
  });
});
