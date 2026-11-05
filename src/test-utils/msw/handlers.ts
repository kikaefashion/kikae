import { http, HttpResponse } from 'msw';

import type { ProductCategory } from '@/api/endpoints/categories';
import type { CurrentUser } from '@/api/endpoints/current-user';
import type { Banner } from '@/api/endpoints/banners';
import type { Category, HomeData, Product } from '@/api/endpoints/home';

/** Matches the test env in `jest.setup.ts` (`EXPO_PUBLIC_API_URL`). */
export const API_URL = 'https://api.test';

/** Matches the test env in `jest.setup.ts` (`EXPO_PUBLIC_AUTH_URL`). */
export const AUTH_URL = 'https://auth.test';

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

export const loginSuccess = http.post(`${AUTH_URL}/login`, () =>
  HttpResponse.json({
    token: 'token-1',
    success: 'You have logged in successfully.',
  }),
);

export const loginInvalid = http.post(`${AUTH_URL}/login`, () =>
  HttpResponse.json({
    errors: 'The credentials you provided could not be verified.',
  }),
);

export const loginUnverified = http.post(`${AUTH_URL}/login`, () =>
  HttpResponse.json({
    errors: 'Please verify your email address before logging in.',
  }),
);

export const loginNetworkError = http.post(`${AUTH_URL}/login`, () =>
  HttpResponse.error(),
);

function makeHomeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: 'Ankara dress',
    price: 12000,
    old_price: 15000,
    status: 'approved',
    units: 5,
    thrift: false,
    made_in_nigeria: true,
    ratings: [{ rating: 4 }, { rating: 5 }],
    store: { id: 'store-1', name: 'Ada Threads', logo: 'profile-pic/logo.webp' },
    media: [{ url: 'profile-pic/dress.webp' }],
    likes: [],
    ...overrides,
  };
}

export const homeProducts: Product[] = [
  makeHomeProduct({ id: 1, name: 'Ankara dress', thrift: true }),
  makeHomeProduct({
    id: 2,
    name: 'Linen shirt',
    price: 0,
    old_price: null,
    units: 0,
    thrift: false,
    made_in_nigeria: false,
    ratings: [],
    store: { id: 'store-2', name: 'Kiki Lagos', logo: null },
    media: [{ url: 'profile-pic/shirt.webp' }],
  }),
];

export const trendingCategories: Category[] = [
  { id: 1, name: 'Fashion', product_count: 3, total_views: 10, image: null },
  { id: 2, name: 'Beauty', product_count: 0, total_views: 0, image: null },
];

export const homeData: HomeData = {
  new_arrivals: homeProducts,
  featured_products: [homeProducts[0]],
  thrift_products: [homeProducts[0]],
  freebies: [homeProducts[1]],
  trending_categories: trendingCategories,
};

const homeEnvelope = (data: unknown) =>
  HttpResponse.json({ status: true, message: 'ok', data });

export const getHomeSuccess = http.get(`${API_URL}/customer/v2/home`, () =>
  homeEnvelope(homeData),
);

export const getHomeEmpty = http.get(`${API_URL}/customer/v2/home`, () =>
  homeEnvelope({
    new_arrivals: [],
    featured_products: [],
    thrift_products: [],
    freebies: [],
    trending_categories: [],
  }),
);

export const getHomeOnlyNewArrivals = http.get(
  `${API_URL}/customer/v2/home`,
  () =>
    homeEnvelope({
      new_arrivals: homeProducts,
      featured_products: [],
      thrift_products: [],
      freebies: [],
      trending_categories: [],
    }),
);

export const getHomeStatusFalse = http.get(`${API_URL}/customer/v2/home`, () =>
  HttpResponse.json({ status: false, message: 'failed' }),
);

export const getHomeServerError = http.get(`${API_URL}/customer/v2/home`, () =>
  HttpResponse.json({ message: 'Server error' }, { status: 500 }),
);

export const likeProductSuccess = http.post(`${API_URL}/likeProduct`, () =>
  HttpResponse.json({ status: true, message: 'ok', data: { liked: true } }),
);

export const likeProductFailure = http.post(`${API_URL}/likeProduct`, () =>
  HttpResponse.json({ status: false, message: 'failed' }),
);

/** Deliberately out of order — the carousel sorts by `position`. */
export const banners: Banner[] = [
  {
    id: 3,
    title: 'Stores',
    text: 'View Various Stores',
    file: 'profile-pic/stores.webp',
    position: 2,
    url: '/stores',
  },
  {
    id: 4,
    title: 'Freebies',
    text: 'View Freebies',
    file: 'profile-pic/freebies.webp',
    position: 3,
    url: '/freebies',
  },
  {
    id: 1,
    title: 'Makeup',
    text: 'View Makeup services',
    file: 'profile-pic/makeup.webp',
    position: 1,
    url: '/',
  },
];

export const getBannersSuccess = http.get(`${API_URL}/banners/all`, () =>
  HttpResponse.json({ status: true, data: banners }),
);

export const getBannersEmpty = http.get(`${API_URL}/banners/all`, () =>
  HttpResponse.json({ status: true, data: [] }),
);

export const getBannersServerError = http.get(`${API_URL}/banners/all`, () =>
  HttpResponse.json({ message: 'Server error' }, { status: 500 }),
);

export const getBannersStatusFalse = http.get(`${API_URL}/banners/all`, () =>
  HttpResponse.json({ status: false, message: 'failed' }),
);

/** Default handlers registered in `jest.setup.ts`. */
export const handlers = [
  getCurrentUserSuccess,
  getCategoriesSuccess,
  getHomeSuccess,
  getBannersSuccess,
];
