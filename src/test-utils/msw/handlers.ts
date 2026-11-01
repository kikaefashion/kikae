import { http, HttpResponse } from 'msw';

import type { ProductCategory } from '@/api/endpoints/categories';
import type { CurrentUser } from '@/api/endpoints/current-user';

/** Matches the test env in `jest.setup.ts` (`EXPO_PUBLIC_API_URL`). */
export const API_URL = 'https://api.test';

export const currentUser: CurrentUser = {
  id: 1,
  fname: 'Ada',
  lname: 'Okafor',
  email: 'ada@example.com',
  phone: '234,8000000000',
  profilePic: null,
  dob: '1990-05-20',
  usertype_id: 1,
  status: true,
  usertype: { id: 1, name: 'Customer', store_id: null },
  addresses: [
    {
      id: 1,
      address: '12 Marina',
      state_id: 25,
      city: 'Lagos',
      isDefault: true,
    },
  ],
  followings: [],
  user_badge: ['New User'],
};

export const categories: ProductCategory[] = [
  {
    id: 1,
    name: 'Fashion',
    description: null,
    subcategories: [
      { id: 11, name: 'Men', productTypes: [{ id: 111, name: 'Shirts' }] },
    ],
  },
  { id: 2, name: 'Beauty', description: null, subcategories: [] },
];

export const getCurrentUserSuccess = http.post(`${API_URL}/currentUser`, () =>
  HttpResponse.json({ status: true, message: 'ok', data: currentUser }),
);

export const getCurrentUserStatusFalse = http.post(
  `${API_URL}/currentUser`,
  () => HttpResponse.json({ status: false, message: 'Account deactivated' }),
);

export const getCurrentUserValidationError = http.post(
  `${API_URL}/currentUser`,
  () =>
    HttpResponse.json(
      {
        message: 'The given data was invalid.',
        errors: { email: ['The email field is required.'] },
      },
      { status: 422 },
    ),
);

export const getCurrentUserUnauthorized = http.post(
  `${API_URL}/currentUser`,
  () => HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }),
);

export const getCurrentUserServerError = http.post(
  `${API_URL}/currentUser`,
  () => HttpResponse.json({ message: 'Server error' }, { status: 500 }),
);

export const getCurrentUserNetworkError = http.post(
  `${API_URL}/currentUser`,
  () => HttpResponse.error(),
);

export const getCurrentUserTimeout = http.post(`${API_URL}/currentUser`, () => {
  // Never resolves — lets the client's AbortController timeout kick in.
  return new Promise(() => {});
});

export const getCategoriesSuccess = http.get(`${API_URL}/v2/categories`, () =>
  HttpResponse.json({ status: true, message: 'ok', data: categories }),
);

export const getCategoriesSchemaMismatch = http.get(
  `${API_URL}/v2/categories`,
  () =>
    HttpResponse.json({
      status: true,
      message: 'ok',
      data: [{ id: true, name: 123 }],
    }),
);

/** Default handlers registered in `jest.setup.ts`. */
export const handlers = [getCurrentUserSuccess, getCategoriesSuccess];
