import { http, HttpResponse } from 'msw';

import { clearSession, setSession } from '@/api/identity';
import {
  addToCart,
  CartLineSchema,
  fetchCart,
  removeFromCart,
  updateCart,
} from '@/api/endpoints/cart';
import { server } from '@/test-utils/msw/server';
import { API_URL } from '@/test-utils/msw/handlers';

afterEach(() => {
  clearSession();
});

describe('CartLineSchema', () => {
  it('drops private store-owner data and unused line fields', () => {
    const parsed = CartLineSchema.parse({
      id: 738,
      user_id: 1,
      product_id: 243,
      color_id: 476,
      size_id: 425,
      units: 1,
      isCustom: '0',
      available_id: null,
      length: 20,
      shoulder: 40,
      neck: 10,
      sleeve: 30,
      biceps: 200,
      armors: 1,
      chests: 90,
      note: 'secret',
      product: {
        id: 243,
        name: 'Black Printed Tribal Pattern Hoodie',
        price: 20000,
        old_price: 27000,
        status: 'approved',
        units: 10,
        isMakeup: 0,
        thrift: false,
        media: [{ id: 672, url: 'profile-pic/product-243.webp' }],
        colours: [{ id: 476, name: 'Black', value: '#000000' }],
        sizes: [
          { id: 424, size: '42' },
          { id: 425, size: '30' },
        ],
        shop: {
          id: '00000000-0000-4000-8000-000000000001',
          name: 'Sample Store',
          email: 'store@example.com',
          phone: '2340000000000',
          balance: 0,
          hash: 'REDACTED',
          user: {
            email: 'owner@example.com',
            addresses: [{ address: '1 Example Street' }],
          },
        },
      },
    });

    expect(parsed.id).toBe(738);
    expect(parsed.isCustom).toBe('0');
    expect(parsed.units).toBe(1);
    expect(parsed.product.name).toBe('Black Printed Tribal Pattern Hoodie');
    expect(parsed.product.isMakeup).toBe(false);
    expect(parsed.product.sizes).toEqual([
      { id: 424, size: '42' },
      { id: 425, size: '30' },
    ]);
    expect(parsed.product.colours).toEqual([{ id: 476, name: 'Black' }]);
    expect(parsed.product.media).toEqual([
      { url: 'profile-pic/product-243.webp' },
    ]);

    const json = JSON.stringify(parsed);
    for (const key of [
      'user_id',
      'product_id',
      'length',
      'shoulder',
      'neck',
      'sleeve',
      'biceps',
      'armors',
      'chests',
      'note',
      'shop',
      'email',
      'phone',
      'balance',
      'hash',
      'addresses',
      'value',
    ]) {
      expect(json).not.toContain(key);
    }
  });
});

describe('cart endpoints', () => {
  it('addToCart sends the exact legacy body and auth header', async () => {
    setSession({ token: 't', userId: 1 });
    let capturedBody: unknown;
    let capturedMethod = '';
    let capturedPathname = '';
    let capturedAuth = '';

    server.use(
      http.post(`${API_URL}/addToCart`, async ({ request }) => {
        capturedBody = await request.json();
        capturedMethod = request.method;
        capturedPathname = new URL(request.url).pathname;
        capturedAuth = request.headers.get('Authorization') ?? '';
        return HttpResponse.json({
          success: true,
          message: 'Successfully added to cart.',
        });
      }),
    );

    await addToCart({ units: 1, productId: 243, sizeId: 425, colorId: 476 });

    expect(capturedPathname).toBe('/addToCart');
    expect(capturedMethod).toBe('POST');
    expect(capturedBody).toEqual({
      units: 1,
      product_id: 243,
      size_id: 425,
      color_id: 476,
    });
    expect(capturedAuth).toBe('Bearer t');
  });

  it('getCart sends {user_id} from the identity module', async () => {
    setSession({ token: 't', userId: 264 });
    let capturedBody: unknown;

    server.use(
      http.post(`${API_URL}/getCart`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({ status: true, message: 'ok', data: [] });
      }),
    );

    const result = await fetchCart();

    expect(capturedBody).toEqual({ user_id: 264 });
    expect(result).toEqual({ lines: [], failedCount: 0 });
  });

  it('getCart sends a string user_id unchanged', async () => {
    setSession({ token: 't', userId: 'user-abc' });
    let capturedBody: unknown;

    server.use(
      http.post(`${API_URL}/getCart`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({ status: true, message: 'ok', data: [] });
      }),
    );

    await fetchCart();

    expect(capturedBody).toEqual({ user_id: 'user-abc' });
  });

  it('getCart parses each line separately and counts failures', async () => {
    setSession({ token: 't', userId: 264 });

    server.use(
      http.post(`${API_URL}/getCart`, () =>
        HttpResponse.json({
          status: true,
          message: 'ok',
          data: [
            {
              id: 738,
              units: 1,
              size_id: null,
              color_id: null,
              isCustom: '0',
              available_id: null,
              product: {
                id: 243,
                name: 'Hoodie',
                price: 20000,
                old_price: null,
                units: 10,
                status: 'approved',
                isMakeup: 0,
                thrift: false,
                media: [],
                sizes: [],
                colours: [],
              },
            },
            { id: 'not-a-valid-line' },
          ],
        }),
      ),
    );

    const result = await fetchCart();

    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].id).toBe(738);
    expect(result.failedCount).toBe(1);
  });

  it('getCart throws when data is not an array', async () => {
    setSession({ token: 't', userId: 264 });

    server.use(
      http.post(`${API_URL}/getCart`, () =>
        HttpResponse.json({ status: true, message: 'ok', data: { id: 1 } }),
      ),
    );

    await expect(fetchCart()).rejects.toMatchObject({ kind: 'parse' });
  });

  it('updateCart sends {units, user_id, id, product_id} and returns the line', async () => {
    setSession({ token: 't', userId: 264 });
    let capturedBody: unknown;

    server.use(
      http.post(`${API_URL}/updateCart`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({
          status: true,
          message: 'ok',
          data: {
            id: 738,
            units: 3,
            size_id: 425,
            color_id: 476,
            isCustom: '0',
            available_id: null,
            product: {
              id: 243,
              name: 'X',
              price: 1,
              old_price: null,
              units: 10,
              status: 'approved',
              isMakeup: 0,
              thrift: false,
              media: [],
              sizes: [],
              colours: [],
            },
          },
        });
      }),
    );

    const line = await updateCart(738, 3, 243);

    expect(capturedBody).toEqual({
      units: 3,
      user_id: 264,
      id: 738,
      product_id: 243,
    });
    expect(line.units).toBe(3);
    expect(line.id).toBe(738);
  });

  it('removeFromCart tolerates an empty body', async () => {
    let capturedBody: unknown;

    server.use(
      http.post(`${API_URL}/removeFromCart`, async ({ request }) => {
        capturedBody = await request.json();
        return new HttpResponse(null, { status: 200 });
      }),
    );

    await expect(removeFromCart(738)).resolves.toBeUndefined();
    expect(capturedBody).toEqual({ id: 738 });
  });
});
