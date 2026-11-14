import { expect, test, type Page } from '@playwright/test';

import { cartPopulated, type CartLine } from './fixtures';
import { API_URL, mockBackend } from './support/backend';

const guestButton = (page: Page) =>
  page.getByRole('button', { name: 'Continue as guest', exact: true });

/**
 * Cart e2e. `mockBackend` hermetically routes every request to the dummy
 * backend origins — anything unmocked throws, so these flows fail loudly if
 * the app calls an endpoint we forgot to route.
 */
test.describe('cart', () => {
  test('adding from product detail shows the item in the cart', async ({
    page,
    context,
  }) => {
    await mockBackend(page, 'success');
    await context.addInitScript(() => {
      window.localStorage.setItem('kikae.auth.token', 'e2e-fake-token');
    });

    // Stateful cart: starts empty and gains the line once addToCart fires
    // (the add response has no line, so the app refetches `getCart`).
    let lines: CartLine[] = [];
    await page.route(`${API_URL}/getCart`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: true, message: 'ok', data: lines }),
      });
    });
    await page.route(`${API_URL}/addToCart`, async (route) => {
      lines = [cartPopulated.data[0]];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Successfully added to cart.',
        }),
      });
    });

    await page.goto('/product/1');
    await expect(
      page.getByRole('heading', { name: 'Ankara dress' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'S' }).click();
    await page.getByRole('button', { name: 'Red' }).click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.getByText('Added to cart')).toBeVisible();

    await page.getByRole('button', { name: 'View cart' }).click();

    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByText('Ankara dress').first()).toBeVisible();
    await expect(page.getByText('Estimated')).toBeVisible();
  });

  test('a guest reaching /cart is redirected to /login', async ({ page }) => {
    await mockBackend(page, 'success');
    await page.goto('/cart');

    await expect(page).toHaveURL(/\/login\?redirectTo=/);
    await expect(guestButton(page)).toBeVisible();
  });
});
