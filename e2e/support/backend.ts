import type { Page } from '@playwright/test';

import {
  banners,
  categories,
  currentUser,
  home,
  loginInvalid,
  loginSuccess,
  loginUnverified,
  product,
} from '../fixtures';

/**
 * These must match the DUMMY EXPO_PUBLIC_* values inlined at build time by
 * `scripts/test-e2e.js` and the CI `e2e-web` job.
 */
export const AUTH_URL = 'https://auth.e2e.test';
export const API_URL = 'https://api.e2e.test';
export const MEDIA_URL = 'https://media.e2e.test';

const DUMMY_ORIGINS = [AUTH_URL, API_URL, MEDIA_URL];

export type LoginMock = 'success' | 'invalid' | 'unverified' | 'offline';

/**
 * Hermetically mocks the backend. Every request to a dummy host is routed;
 * anything not explicitly mocked throws (so an accidental real call fails the
 * test). Requests to the local web server (assets, SSR) fall through.
 */
export async function mockBackend(
  page: Page,
  login: LoginMock = 'success',
): Promise<void> {
  // Registered first → checked last (Playwright checks the newest route first).
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (DUMMY_ORIGINS.includes(url.origin)) {
      throw new Error(
        `Unmocked network request to dummy host: ${route.request().method()} ${url.toString()}`,
      );
    }
    await route.fallback();
  });

  await page.route(`${AUTH_URL}/login`, async (route) => {
    switch (login) {
      case 'success':
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(loginSuccess),
        });
        return;
      case 'invalid':
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(loginInvalid),
        });
        return;
      case 'unverified':
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(loginUnverified),
        });
        return;
      case 'offline':
        await route.abort('connectionfailed');
        return;
    }
  });

  await page.route(`${API_URL}/currentUser`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(currentUser),
    });
  });

  await page.route(`${API_URL}/v2/categories`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(categories),
    });
  });

  await page.route(/\/customer\/v2\/home/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(home),
    });
  });

  await page.route(`${API_URL}/banners/all`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(banners),
    });
  });

  await page.route(`${API_URL}/likeProduct`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: true,
        message: 'ok',
        data: { liked: true },
      }),
    });
  });

  // Product detail: id 1 is the known product; any other id is a 404.
  await page.route(/\/getProduct\//, async (route) => {
    const url = new URL(route.request().url());
    const id = url.pathname.split('/').pop();
    if (id === '1') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(product),
      });
      return;
    }
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Not found' }),
    });
  });

  await page.route(/\/products\/\d+\/views/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: true, message: 'View added', views: 4 }),
    });
  });

  // Serve a 1x1 image for media requests so product images never hit the
  // "unmocked dummy host" guard and trigger a real network load.
  await page.route(`${MEDIA_URL}/**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        'base64',
      ),
    });
  });
}
