import { http, HttpResponse } from 'msw';

import { clearSession, setSession } from '@/api/identity';
import { server } from '@/test-utils/msw/server';
import { API_URL } from '@/test-utils/msw/handlers';
import { renderHook, waitFor } from '@/test-utils/render';

import { useLikeProduct } from '../use-like-product';

afterEach(() => {
  clearSession();
});

describe('useLikeProduct', () => {
  it('settles the in-flight flag on success', async () => {
    setSession({ token: 't', userId: 7 });
    server.use(
      http.post(`${API_URL}/likeProduct`, () =>
        HttpResponse.json({ status: true, message: 'ok', data: {} }),
      ),
    );

    const { result } = await renderHook(() => useLikeProduct(7));
    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.isPending).toBe(false);
  });

  it('settles the in-flight flag on error', async () => {
    setSession({ token: 't', userId: 7 });
    server.use(
      http.post(`${API_URL}/likeProduct`, () =>
        HttpResponse.json({ status: false, message: 'failed' }),
      ),
    );

    const { result } = await renderHook(() => useLikeProduct(7));
    result.current.mutate(1);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isPending).toBe(false);
  });
});
