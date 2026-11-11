import { http, HttpResponse } from 'msw';

import { clearSession, setSession } from '@/api/identity';
import { likeProduct } from '@/api/endpoints/like-product';
import { server } from '@/test-utils/msw/server';
import { API_URL } from '@/test-utils/msw/handlers';

afterEach(() => {
  clearSession();
});

describe('likeProduct', () => {
  it('sends the exact legacy request body and path', async () => {
    setSession({ token: 't', userId: 264 });
    let capturedBody: unknown;
    let capturedMethod = '';
    let capturedPathname = '';

    server.use(
      http.post(`${API_URL}/likeProduct`, async ({ request }) => {
        capturedBody = await request.json();
        capturedMethod = request.method;
        capturedPathname = new URL(request.url).pathname;
        return HttpResponse.json({
          status: true,
          message: 'Successfully liked.',
          data: { liked: true },
        });
      }),
    );

    await likeProduct(42);

    expect(capturedPathname).toBe('/likeProduct');
    expect(capturedMethod).toBe('POST');
    expect(capturedBody).toEqual({ product_id: 42, like: true, user_id: 264 });
  });

  it('sends string ids through unchanged', async () => {
    setSession({ token: 't', userId: '264' });
    let capturedBody: unknown;

    server.use(
      http.post(`${API_URL}/likeProduct`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({ status: true, message: 'ok', data: {} });
      }),
    );

    await likeProduct('42');

    expect(capturedBody).toEqual({
      product_id: '42',
      like: true,
      user_id: '264',
    });
  });

  it('times out a hanging request', async () => {
    setSession({ token: 't', userId: 1 });
    server.use(
      http.post(`${API_URL}/likeProduct`, () => new Promise(() => {})),
    );

    await expect(likeProduct(1, { timeoutMs: 20 })).rejects.toMatchObject({
      kind: 'timeout',
    });
  });
});
