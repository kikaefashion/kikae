import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { mockBackend, type LoginMock } from './support/backend';

const email = (page: Page) => page.getByLabel('Email', { exact: true });
const password = (page: Page) => page.getByLabel('Password', { exact: true });
const loginButton = (page: Page) =>
  page.getByRole('button', { name: 'Login', exact: true });
const guestButton = (page: Page) =>
  page.getByRole('button', { name: 'Continue as guest', exact: true });

async function openLogin(
  page: Page,
  login: LoginMock = 'success',
): Promise<void> {
  await mockBackend(page, login);
  await page.goto('/login');
  await expect(email(page)).toBeVisible();
}

async function fillAndSubmit(
  page: Page,
  user = 'ada@example.com',
  pass = 'password',
) {
  await email(page).fill(user);
  await password(page).fill(pass);
  await loginButton(page).click();
}

/** The tab bar renders Home/Discover tabs; only the tabs layout has them. */
async function expectOnTabs(page: Page): Promise<void> {
  await expect(
    page.getByRole('tab', { name: 'Home', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('tab', { name: 'Discover', exact: true }),
  ).toBeVisible();
}

test.describe('login flow', () => {
  test('successful login lands on the tabs', async ({ page }) => {
    await openLogin(page, 'success');
    await fillAndSubmit(page);

    await expectOnTabs(page);
    await expect(page).toHaveURL('/');
  });

  test('wrong password shows the generic inline error', async ({ page }) => {
    await openLogin(page, 'invalid');
    await fillAndSubmit(page, 'ada@example.com', 'wrong-password');

    await expect(page.getByText('Incorrect email or password')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    await expect(loginButton(page)).toBeVisible();
  });

  test('unverified account shows the inline message', async ({ page }) => {
    await openLogin(page, 'unverified');
    await fillAndSubmit(page);

    await expect(
      page.getByText('Please verify your email address before logging in.'),
    ).toBeVisible();
    await expect(loginButton(page)).toBeVisible();
  });

  test('offline shows the banner and keeps typed values', async ({
    page,
    context,
  }) => {
    await openLogin(page, 'offline');
    await email(page).fill('ada@example.com');
    await password(page).fill('password');
    await context.setOffline(true);
    await loginButton(page).click();

    await expect(
      page.getByText("You're offline — check your connection"),
    ).toBeVisible();
    await expect(email(page)).toHaveValue('ada@example.com');
    await expect(password(page)).toHaveValue('password');
  });

  test('guest flow opens the tabs', async ({ page }) => {
    await openLogin(page, 'success');
    await guestButton(page).click();

    await expectOnTabs(page);
    await expect(page).toHaveURL('/');
  });

  test('signed-in user opening /login is redirected', async ({
    page,
    context,
  }) => {
    await mockBackend(page, 'success');
    await context.addInitScript(() => {
      window.localStorage.setItem('kikae.auth.token', 'e2e-fake-token');
    });

    await page.goto('/login');

    await expect(page).toHaveURL('/');
    await expectOnTabs(page);
  });

  test('redirectTo with an external URL is ignored', async ({ page }) => {
    const external = 'https://evil.example.com/steal';
    await mockBackend(page, 'success');
    await page.goto(`/login?redirectTo=${encodeURIComponent(external)}`);
    await expect(email(page)).toBeVisible();

    await fillAndSubmit(page);

    await expect(page).toHaveURL('/');
    await expectOnTabs(page);
  });

  test('session survives reload', async ({ page }) => {
    await openLogin(page, 'success');
    await fillAndSubmit(page);
    await expectOnTabs(page);

    await page.reload();

    await expectOnTabs(page);
    await expect(page).toHaveURL('/');
  });

  test('keyboard: Tab order follows Email → Password → toggle → Login → guest', async ({
    page,
  }) => {
    await openLogin(page, 'success');

    await expect(email(page)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(password(page)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('button', { name: 'Show password', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(loginButton(page)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(guestButton(page)).toBeFocused();
  });

  test('keyboard: Enter submits the login form', async ({ page }) => {
    await openLogin(page, 'success');

    await email(page).fill('ada@example.com');
    await email(page).press('Enter');
    await expect(password(page)).toBeFocused();

    await password(page).fill('password');
    await password(page).press('Enter');

    await expectOnTabs(page);
    await expect(page).toHaveURL('/');
  });
});

test.describe('login accessibility', () => {
  const viewports = [
    { width: 375, height: 812 },
    { width: 1280, height: 800 },
  ] as const;
  const schemes = ['light', 'dark'] as const;

  for (const viewport of viewports) {
    for (const colorScheme of schemes) {
      test(`no serious/critical violations at ${viewport.width}x${viewport.height} (${colorScheme})`, async ({
        page,
      }) => {
        await mockBackend(page, 'success');
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme });
        await page.goto('/login');
        await expect(email(page)).toBeVisible();

        const results = await new AxeBuilder({ page }).analyze();
        const violations = results.violations.filter(
          (violation) =>
            violation.impact === 'serious' || violation.impact === 'critical',
        );

        expect(
          violations.map(
            (violation) => `${violation.id} (${violation.impact})`,
          ),
        ).toEqual([]);
      });
    }
  }
});
