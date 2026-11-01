import { ProductCategoryListSchema } from '../endpoints/categories';
import { CurrentUserSchema } from '../endpoints/current-user';

describe('endpoint schemas', () => {
  it('CurrentUserSchema strips sensitive backend fields', () => {
    const parsed = CurrentUserSchema.parse({
      id: 1,
      fname: 'Ada',
      lname: 'Okafor',
      email: 'ada@example.com',
      phone: '234,8000000000',
      profilePic: null,
      dob: '1970-01-01',
      usertype_id: 3,
      status: 1,
      code: 'ABC123',
      email_verification_code: '123456',
      provider: 'google',
      provider_id: 'x',
      referrer_id: 2,
      referrer_type: 'users',
      isVendor: null,
      isAdmin: null,
      usertype: { id: 3, name: 'Vendor', store_id: 'uuid-store' },
      addresses: [{ id: 1, address: '12 Marina', state_id: 25 }],
      followings: [],
      user_badge: ['Day One'],
    });

    expect(parsed.dob).toBeNull(); // "1970-01-01" sentinel normalized
    expect(parsed.phone).toBe('234,8000000000');
    expect(parsed.usertype?.store_id).toBe('uuid-store');

    for (const key of [
      'code',
      'email_verification_code',
      'provider',
      'provider_id',
      'referrer_id',
      'referrer_type',
      'isVendor',
      'isAdmin',
    ]) {
      expect(key in parsed).toBe(false);
    }
  });

  it('parses categories keyed by id (names may repeat)', () => {
    const parsed = ProductCategoryListSchema.parse([
      {
        id: 1,
        name: 'Fashion',
        description: null,
        subcategories: [
          { id: 11, name: 'Men', productTypes: [{ id: 111, name: 'Shirts' }] },
        ],
      },
      { id: 2, name: 'Fashion', description: null },
    ]);

    expect(parsed[0].subcategories[0].id).toBe(11);
    expect(parsed[0].subcategories[0].productTypes[0].id).toBe(111);
    // Two categories can share a name; ids are unique.
    expect(parsed[0].name).toBe(parsed[1].name);
    expect(parsed[0].id).not.toBe(parsed[1].id);
  });
});
