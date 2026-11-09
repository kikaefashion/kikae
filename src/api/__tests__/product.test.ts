import { server } from '@/test-utils/msw/server';
import {
  getProductEmpty,
  getProductNotFound,
  getProductStatusFalse,
  getProductSuccess,
  trackProductViewServerError,
  trackProductViewSuccess,
} from '@/test-utils/msw/handlers';

import {
  fetchProduct,
  ProductDetailSchema,
  trackProductView,
} from '../endpoints/product';

describe('ProductDetailSchema', () => {
  it('drops private store data and everything else', () => {
    const parsed = ProductDetailSchema.parse({
      id: 248,
      name: 'Test Makeup',
      price: 15000,
      old_price: null,
      status: 'approved',
      units: 1,
      thrift: null,
      description: 'nothing special',
      media: [{ id: 677, url: 'profile-pic/x.webp', product_id: 248 }],
      sizes: [{ id: 1, size: 'M', product_id: 248 }],
      colours: [{ id: 1, name: 'Red', value: '#000000', product_id: 248 }],
      ratings: [{ id: 8, rating: 5, user_id: 264 }],
      store: {
        id: 'store-1',
        name: 'Dexha Fashion',
        logo: 'profile-pic/logo.webp',
        email: 'owner@example.com',
        phone: '2348000000000',
        code: 'OTP123',
        hash: 'hashed-password',
        balance: '999999',
        addresses: [{ city: 'Lagos' }],
      },
      likes: [{ user_id: 7, like: 1 }],
      isMakeup: 1,
      offer: 'home',
      coverages: [{ id: 102, area: 'Ugbowo', fee: '5000' }],
      availability: [{ id: 269, dated: 'Sunday,06:00 - 18:00', available: 1 }],
      views: 10,
      sponsored: 0,
      private_field: 'nope',
    });

    expect(parsed.name).toBe('Test Makeup');
    expect(parsed.isMakeup).toBe(true);
    expect(parsed.coverages).toEqual([{ area: 'Ugbowo', fee: 5000 }]);
    expect(parsed.availability).toEqual([
      { dated: 'Sunday,06:00 - 18:00', available: true },
    ]);
    expect(parsed.sizes).toEqual([{ size: 'M' }]);
    expect(parsed.colours).toEqual([{ name: 'Red' }]);
    expect(parsed.media).toEqual([{ url: 'profile-pic/x.webp' }]);
    expect(parsed.store).toEqual({
      id: 'store-1',
      name: 'Dexha Fashion',
      logo: 'profile-pic/logo.webp',
    });

    const json = JSON.stringify(parsed);
    for (const key of [
      'email',
      'phone',
      'code',
      'hash',
      'balance',
      'addresses',
      'views',
      'sponsored',
      'private_field',
      'product_id',
    ]) {
      expect(json).not.toContain(key);
    }
  });
});

describe('fetchProduct', () => {
  it('returns the parsed product', async () => {
    server.use(getProductSuccess);
    const product = await fetchProduct(248);
    expect(product?.name).toBe('Test Makeup');
    expect(product?.coverages).toEqual([{ area: 'Ugbowo', fee: 5000 }]);
  });

  it('returns null on 404', async () => {
    server.use(getProductNotFound);
    await expect(fetchProduct(999)).resolves.toBeNull();
  });

  it('returns null on status false', async () => {
    server.use(getProductStatusFalse);
    await expect(fetchProduct(248)).resolves.toBeNull();
  });

  it('returns null on empty data', async () => {
    server.use(getProductEmpty);
    await expect(fetchProduct(248)).resolves.toBeNull();
  });
});

describe('trackProductView', () => {
  it('resolves on success', async () => {
    server.use(trackProductViewSuccess);
    await expect(trackProductView(248)).resolves.toBeUndefined();
  });

  it('ignores errors', async () => {
    server.use(trackProductViewServerError);
    await expect(trackProductView(248)).resolves.toBeUndefined();
  });
});
