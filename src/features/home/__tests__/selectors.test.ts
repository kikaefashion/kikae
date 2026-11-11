import type { HomeData, Product } from '@/api/endpoints/home';

import { addLike, isLikedBy, toCardProduct } from '../selectors';

const product: Product = {
  id: 1,
  name: 'Ankara dress',
  price: 12000,
  old_price: 15000,
  status: 'approved',
  units: 5,
  thrift: true,
  made_in_nigeria: true,
  ratings: [{ rating: 4 }, { rating: 5 }],
  store: { id: 'store-1', name: 'Ada Threads', logo: 'profile-pic/logo.webp' },
  media: [{ url: 'profile-pic/dress.webp' }],
  likes: [{ user_id: 7, like: 1 }],
};

describe('isLikedBy', () => {
  it('coerces the session id and like user_id to numbers in both directions', () => {
    expect(isLikedBy([{ user_id: 264, like: 1 }], '264')).toBe(true);
    expect(isLikedBy([{ user_id: '264', like: 1 }], 264)).toBe(true);
  });

  it('is true when a like matches the user id with like 1 or true', () => {
    expect(isLikedBy([{ user_id: 7, like: 1 }], 7)).toBe(true);
    expect(isLikedBy([{ user_id: 7, like: true }], 7)).toBe(true);
  });

  it('is false for other users or a null user', () => {
    expect(isLikedBy([{ user_id: 8, like: 1 }], 7)).toBe(false);
    expect(isLikedBy([{ user_id: 7, like: 1 }], null)).toBe(false);
  });

  it('is false when the like value is 0 or false', () => {
    expect(isLikedBy([{ user_id: 7, like: 0 }], 7)).toBe(false);
    expect(isLikedBy([{ user_id: 7, like: false }], 7)).toBe(false);
  });
});

describe('toCardProduct', () => {
  it('maps fields and resolves the media URL', () => {
    expect(toCardProduct(product)).toEqual({
      id: 1,
      name: 'Ankara dress',
      storeName: 'Ada Threads',
      price: 12000,
      oldPrice: 15000,
      units: 5,
      thrift: true,
      ratings: [{ rating: 4 }, { rating: 5 }],
      imageUrl: 'https://media.test/profile-pic/dress.webp',
    });
  });
});

describe('addLike', () => {
  it('adds the like to every section where the product appears', () => {
    const data: HomeData = {
      new_arrivals: [product],
      featured_products: [{ ...product, id: 2 }],
      thrift_products: [product],
      freebies: [],
      trending_categories: [],
    };

    const updated = addLike(data, 1, 7);

    expect(updated.new_arrivals[0].likes).toHaveLength(2);
    expect(updated.thrift_products[0].likes).toHaveLength(2);
    expect(updated.featured_products[0].likes).toHaveLength(1);
  });

  it('matches a string product id against numeric product ids', () => {
    const data: HomeData = {
      new_arrivals: [product],
      featured_products: [],
      thrift_products: [],
      freebies: [],
      trending_categories: [],
    };

    const updated = addLike(data, '1', 7);

    expect(updated.new_arrivals[0].likes).toHaveLength(2);
  });
});
