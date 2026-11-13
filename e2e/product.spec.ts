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
    await expect(
      page.getByRole('heading', { name: 'Ankara dress' }),
    ).toBeVisible();
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
    await expect(
      page.getByRole('heading', { name: 'Ankara dress' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Add to wishlist' }).click();

    await expect(page).toHaveURL(/\/login/);
  });

  test('a guest Add to cart tap reaches /login', async ({ page }) => {
    await openHomeAsGuest(page);
    await page.getByText('Ankara dress').first().click();
    await expect(page).toHaveURL(/\/product\/1/);
    await expect(
      page.getByRole('heading', { name: 'Ankara dress' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Add to cart' }).click();

    await expect(page).toHaveURL(/\/login/);
  });

  test('a signed-in add to cart shows the toast', async ({ page, context }) => {
    await mockBackend(page, 'success');
    await context.addInitScript(() => {
      window.localStorage.setItem('kikae.auth.token', 'e2e-fake-token');
    });
    await page.goto('/product/1');
    await expect(
      page.getByRole('heading', { name: 'Ankara dress' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'S' }).click();
    await page.getByRole('button', { name: 'Red' }).click();
    await page.getByRole('button', { name: 'Add to cart' }).click();

    await expect(page.getByText('Added to cart')).toBeVisible();
  });

  test('a freebie navigates to the checkout stub with ids only', async ({
    page,
    context,
  }) => {
    await mockBackend(page, 'success');
    await context.addInitScript(() => {
      window.localStorage.setItem('kikae.auth.token', 'e2e-fake-token');
    });
    await page.goto('/product/2');
    await expect(
      page.getByRole('heading', { name: 'Free tote bag' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'One size' }).click();
    await page.getByRole('button', { name: 'Natural' }).click();
    await page.getByRole('button', { name: 'Get for free' }).click();

    await expect(page).toHaveURL(
      /\/checkout\?mode=buyNow&product=2&size=4&color=5&units=1/,
    );
  });
});
