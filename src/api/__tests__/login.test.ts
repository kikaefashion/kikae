import { http, HttpResponse } from 'msw';

import { server } from '@/test-utils/msw/server';

import { login } from '../endpoints/login';

import { AUTH_URL, loginInvalid, loginSuccess, loginUnverified } from '@/test-utils/msw/handlers';

describe('login', () => {
  it('maps a successful response to success with the token', async () => {
    server.use(loginSuccess);

    await expect(login('ada@example.com', 'password')).resolves.toEqual({
      kind: 'success',
      token: 'token-1',
    });
  });

  it('maps wrong credentials to invalid', async () => {
    server.use(loginInvalid);

    await expect(login('ada@example.com', 'wrong')).resolves.toEqual({
      kind: 'invalid',
    });
  });

  it('maps the unverified text to unverified', async () => {
    server.use(loginUnverified);

    await expect(login('ada@example.com', 'password')).resolves.toEqual({
      kind: 'unverified',
    });
  });

  it('maps a network failure to network', async () => {
    server.use(http.post(`${AUTH_URL}/login`, () => HttpResponse.error()));

    await expect(login('ada@example.com', 'password')).resolves.toEqual({
      kind: 'network',
    });
  });

  it('maps an unexpected body to unknown', async () => {
    server.use(
      http.post(`${AUTH_URL}/login`, () => HttpResponse.json({ foo: 'bar' })),
    );

    await expect(login('ada@example.com', 'password')).resolves.toEqual({
      kind: 'unknown',
    });
  });
});
