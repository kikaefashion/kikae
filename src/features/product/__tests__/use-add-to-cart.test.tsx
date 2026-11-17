import { http, HttpResponse } from 'msw';
import { View } from 'react-native';

import type { ProductDetail } from '@/api/endpoints/product';
import { clearSession, setSession } from '@/api/identity';
import { useCart } from '@/api/queries/use-cart';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  addToCartSuccess,
  API_URL,
  cartLine,
  normalProduct,
} from '@/test-utils/msw/handlers';
import { server } from '@/test-utils/msw/server';
import { fireEvent, render, screen } from '@/test-utils/render';

import { useAddToCart } from '../use-add-to-cart';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

function Harness({ product }: { product: ProductDetail }) {
  const cart = useCart();
  const add = useAddToCart();

  return (
    <View>
      <Text>count:{cart.data?.lines.length ?? 0}</Text>
      <Text>stale:{String(cart.isStale)}</Text>
      <Button
        onPress={() => add.mutate({ product, sizeId: 1, colorId: 3, units: 1 })}
      >
        Add
      </Button>
    </View>
  );
}

describe('useAddToCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearSession();
  });

  it('invalidates and refetches the cart after a fresh add, leaving the cache fresh', async () => {
    setSession({ token: 't', userId: 1 });
    let getCartCalls = 0;

    server.use(
      http.post(`${API_URL}/getCart`, () => {
        getCartCalls += 1;
        const data = getCartCalls === 1 ? [] : [cartLine];
        return HttpResponse.json({ status: true, message: 'ok', data });
      }),
      addToCartSuccess,
    );

    await render(<Harness product={normalProduct} />);

    // The cart query is populated empty before the add.
    await screen.findByText('count:0');

    await fireEvent.press(screen.getByRole('button', { name: 'Add' }));

    // The add response carries no line, so the cart must be refetched.
    await screen.findByText('count:1');
    expect(getCartCalls).toBe(2);
    await screen.findByText('stale:false');
  });

  it('refetches the cart after a fresh add even when the initial read is still in-flight', async () => {
    setSession({ token: 't', userId: 1 });
    let getCartCalls = 0;
    const initial = {
      resolve: (_response: Response): void => undefined,
    };
    const initialPending = new Promise<Response>((resolve) => {
      initial.resolve = resolve;
    });

    server.use(
      http.post(`${API_URL}/getCart`, () => {
        getCartCalls += 1;
        if (getCartCalls === 1) return initialPending;
        return HttpResponse.json({
          status: true,
          message: 'ok',
          data: [cartLine],
        });
      }),
      addToCartSuccess,
    );

    await render(<Harness product={normalProduct} />);

    // The initial cart read is still pending, so the cart stays empty.
    expect(screen.getByText('count:0')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Add' }));

    // The add must start a fresh read instead of waiting on the stale pending
    // one, so the cart shows the added line.
    await screen.findByText('count:1');
    expect(getCartCalls).toBe(2);

    // Settling the stale pending read empty afterwards must not clobber it.
    initial.resolve(
      HttpResponse.json({ status: true, message: 'ok', data: [] }),
    );
    await screen.findByText('count:1');
  });
});
