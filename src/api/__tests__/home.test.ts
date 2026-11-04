import { HomeDataSchema } from '../endpoints/home';

describe('HomeDataSchema', () => {
  it('strips sensitive fields and filters non-approved products', () => {
    const parsed = HomeDataSchema.parse({
      new_arrivals: [
        {
          id: 1,
          name: 'Ankara dress',
          price: '12000',
          old_price: '15000',
          status: 'approved',
          units: '5',
          thrift: 0,
          made_in_nigeria: 1,
          rating: '4.5',
          store: {
            id: 'uuid-store',
            name: 'Ada Threads',
            logo: 'profile-pic/logo.webp',
            email: 'owner@example.com',
            phone: '2348000000000',
            code: 'OTP123',
            hash: 'hashed-password',
            balance: '999999',
            addresses: [{ city: 'Lagos' }],
          },
          media: [{ url: 'profile-pic/x.webp' }],
          likes: [{ user_id: 7, like: 1 }],
          private_field: 'nope',
        },
        {
          id: 2,
          name: 'Rejected item',
          price: 1,
          old_price: null,
          status: 'rejected',
          units: 0,
          thrift: null,
          made_in_nigeria: null,
          rating: null,
          store: { id: 2, name: 'X', logo: null },
          media: [],
          likes: [],
        },
      ],
      featured_products: [],
      thrift_products: [],
      freebies: [],
      trending_categories: [
        {
          id: 1,
          name: 'Fashion',
          product_count: '3',
          total_views: '10',
          image: null,
        },
      ],
      sponsored: [],
      fashion_news: [],
      runway_videos: [],
    });

    expect(parsed.new_arrivals).toHaveLength(1);
    const product = parsed.new_arrivals[0];
    expect(product.name).toBe('Ankara dress');
    expect(product.price).toBe(12000);
    expect(product.old_price).toBe(15000);
    expect(product.units).toBe(5);
    expect(product.thrift).toBe(false);
    expect(product.made_in_nigeria).toBe(true);
    expect(product.rating).toBe(4.5);

    // Sensitive fields never reach the parsed output.
    const json = JSON.stringify(parsed);
    for (const key of [
      'email',
      'phone',
      'code',
      'hash',
      'balance',
      'addresses',
    ]) {
      expect(json).not.toContain(key);
    }

    // Unknown top-level keys are dropped.
    expect('sponsored' in parsed).toBe(false);
  });
});
