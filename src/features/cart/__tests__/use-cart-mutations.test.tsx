import { http, HttpResponse } from 'msw';
import { View } from 'react-native';

import { clearSession, setSession } from '@/api/identity';
import { useCart } from '@/api/queries/use-cart';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  API_URL,
  cartLine,
  removeFromCartSuccess,
  updateCartSuccess,
} from '@/test-utils/msw/handlers';
import { server } from '@/test-utils/msw/server';
import { fireEvent, render, screen } from '@/test-utils/render';

import { useCartMutations } from '../use-cart-mutations';

function Harness() {
  const cart = useCart();
  const { update, remove } = useCartMutations();
  const units = cart.data?.lines[0]?.units ?? 0;

  return (
    <View>
      <Text>count:{cart.data?.lines.length ?? 0}</Text>
      <Text>units:{units}</Text>
      <Button onPress={() => remove.mutate(cartLine)}>Remove</Button>
      <Button onPress={() => update.mutate({ line: cartLine, units: 3 })}>
        Update
      </Button>
    </View>
  );
}

describe('useCartMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearSession();
  });

  it('remove invalidates and refetches the cart', async () => {
    setSession({ token: 't', userId: 1 });
    let getCartCalls = 0;

    server.use(
      http.post(`${API_URL}/getCart`, () => {
        getCartCalls += 1;
        return HttpResponse.json({
          status: true,
          message: 'ok',
          data: getCartCalls === 1 ? [cartLine] : [],
        });
      }),
      removeFromCartSuccess,
    );

    await render(<Harness />);
    await screen.findByText('count:1');

    await fireEvent.press(screen.getByRole('button', { name: 'Remove' }));

    await screen.findByText('count:0');
    expect(getCartCalls).toBe(2);
  });

  it('update settles the cache from its response without refetching', async () => {
    setSession({ token: 't', userId: 1 });
    let getCartCalls = 0;

    server.use(
      http.post(`${API_URL}/getCart`, () => {
        getCartCalls += 1;
        return HttpResponse.json({
          status: true,
          message: 'ok',
          data: [cartLine],
        });
      }),
      updateCartSuccess,
    );

    await render(<Harness />);
    await screen.findByText('units:1');

    await fireEvent.press(screen.getByRole('button', { name: 'Update' }));

    await screen.findByText('units:3');
    expect(getCartCalls).toBe(1);
  });
});
