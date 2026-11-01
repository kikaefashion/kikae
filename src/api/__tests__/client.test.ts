import { http, HttpResponse } from 'msw';

import { server } from '@/test-utils/msw/server';
import {
  API_URL,
  getCategoriesSchemaMismatch,
  getCategoriesSuccess,
  getCurrentUserNetworkError,
  getCurrentUserServerError,
  getCurrentUserStatusFalse,
  getCurrentUserTimeout,
  getCurrentUserUnauthorized,
  getCurrentUserValidationError,
} from '@/test-utils/msw/handlers';

import { request } from '../client';
import { fetchCategories } from '../endpoints/categories';
import { fetchCurrentUser } from '../endpoints/current-user';
import { isApiError } from '../errors';
import { clearSession, hasSession, setSession } from '../identity';

afterEach(() => {
  clearSession();
});

describe('API client', () => {
  it('parses a successful responder envelope', async () => {
    const user = await fetchCurrentUser();
    expect(user.fname).toBe('Ada');
    expect(user.lname).toBe('Okafor');
  });

  it('treats HTTP 200 status:false as an api error', async () => {
    server.use(getCurrentUserStatusFalse);
    await expect(fetchCurrentUser()).rejects.toMatchObject({ kind: 'api' });
  });

  it('maps 422 to a validation error with field errors', async () => {
    server.use(getCurrentUserValidationError);
    const error = await fetchCurrentUser().catch((e: unknown) => e);
    if (!isApiError(error)) {
      throw new Error('expected an ApiError');
    }
    expect(error.kind).toBe('validation');
    expect(error.fieldErrors?.email).toEqual(['The email field is required.']);
  });

  it('clears the session on 401 (no refresh)', async () => {
    setSession({ token: 'test-token', userId: 1 });
    server.use(getCurrentUserUnauthorized);
    await expect(fetchCurrentUser()).rejects.toMatchObject({
      kind: 'unauthorized',
    });
    expect(hasSession()).toBe(false);
  });

  it('maps 5xx to an http error with the status', async () => {
    server.use(getCurrentUserServerError);
    const error = await fetchCurrentUser().catch((e: unknown) => e);
    if (!isApiError(error)) {
      throw new Error('expected an ApiError');
    }
    expect(error.kind).toBe('http');
    expect(error.status).toBe(500);
  });

  it('maps network failure to a network error', async () => {
    server.use(getCurrentUserNetworkError);
    await expect(fetchCurrentUser()).rejects.toMatchObject({ kind: 'network' });
  });

  it('maps a hanging request to a timeout error', async () => {
    server.use(getCurrentUserTimeout);
    await expect(
      request({
        base: 'api',
        path: '/currentUser',
        method: 'POST',
        auth: true,
        timeoutMs: 20,
      }),
    ).rejects.toMatchObject({ kind: 'timeout' });
  });

  it('maps a schema mismatch to a parse error', async () => {
    server.use(getCategoriesSchemaMismatch);
    await expect(fetchCategories()).rejects.toMatchObject({ kind: 'parse' });
  });

  it('fetches categories', async () => {
    server.use(getCategoriesSuccess);
    const result = await fetchCategories();
    expect(result.map((category) => category.name)).toEqual([
      'Fashion',
      'Beauty',
    ]);
  });

  it('parses a raw object without a responder envelope', async () => {
    server.use(
      http.post(`${API_URL}/currentUser`, () =>
        HttpResponse.json({
          id: 1,
          fname: 'Ada',
          lname: 'Okafor',
          email: 'ada@example.com',
          usertype_id: 1,
        }),
      ),
    );

    const user = await fetchCurrentUser();

    expect(user.fname).toBe('Ada');
  });

  it('treats success:0 as a failure', async () => {
    server.use(
      http.post(`${API_URL}/currentUser`, () =>
        HttpResponse.json({ success: 0, message: 'nope' }),
      ),
    );

    await expect(fetchCurrentUser()).rejects.toMatchObject({ kind: 'api' });
  });

  it('surfaces a plain-text error body on a 4xx', async () => {
    server.use(
      http.post(`${API_URL}/currentUser`, () =>
        HttpResponse.text('bad request', { status: 400 }),
      ),
    );

    await expect(
      request({ base: 'api', path: '/currentUser', method: 'POST' }),
    ).rejects.toMatchObject({
      kind: 'http',
      status: 400,
      message: 'bad request',
    });
  });
});
