import { expect, test, type Page } from '@playwright/test';

import { mockBackend } from './support/backend';

const email = (page: Page) => page.getByLabel('Email', { exact: true });
const guestButton = (page: Page) =>
  page.getByRole('button', { name: 'Continue as guest', exact: true });

test.describe('document titles', () => {
  test('/login exposes a non-empty, distinct title', async ({ page }) => {
    await mockBackend(page, 'success');
    await page.goto('/login');
    await expect(email(page)).toBeVisible();

    const title = await page.title();
    expect(title).not.toBe('');
    await expect(page).toHaveTitle('Log in | Kikae');
  });

  test('the home route exposes a non-empty, distinct title', async ({
    page,
  }) => {
    await mockBackend(page, 'success');
    await page.goto('/login');
    await guestButton(page).click();
    await expect(
      page.getByRole('tab', { name: 'Home', exact: true }),
    ).toBeVisible();

    const title = await page.title();
    expect(title).not.toBe('');
    expect(title).not.toBe('Log in | Kikae');
    await expect(page).toHaveTitle('Home | Kikae');
  });
});
