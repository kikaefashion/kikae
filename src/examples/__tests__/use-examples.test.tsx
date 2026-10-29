import { http, HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/render';
import {
  EXAMPLES_ENDPOINT,
  exampleItems,
  getExamplesError,
} from '@/test-utils/msw/handlers';
import { server } from '@/test-utils/msw/server';

import { useExamples } from '../use-examples';

describe('useExamples', () => {
  it('transitions from loading to success', async () => {
    let resolveResponse: (response: Response) => void = () => {};
    server.use(
      http.get(
        EXAMPLES_ENDPOINT,
        () =>
          new Promise<Response>((resolve) => {
            resolveResponse = resolve;
          }),
      ),
    );

    const { result } = await renderHook(() => useExamples());

    expect(result.current.isPending).toBe(true);

    resolveResponse(HttpResponse.json(exampleItems));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0]?.title).toBe('First example');
  });

  it('reports an error on a failed request', async () => {
    server.use(getExamplesError);

    const { result } = await renderHook(() => useExamples());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
