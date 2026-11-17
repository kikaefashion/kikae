import type { ReactNode } from 'react';
import {
  NetInfoStateType,
  useNetInfo,
  type NetInfoState,
} from '@react-native-community/netinfo';
import { http, HttpResponse } from 'msw';

import type { CartLine } from '@/api/endpoints/cart';
import { clearSession, setSession } from '@/api/identity';
import { API_URL, removeFromCartSuccess } from '@/test-utils/msw/handlers';
import { server } from '@/test-utils/msw/server';
import { fireEvent, render, screen } from '@/test-utils/render';

import { CartScreen } from '../cart-screen';

jest.mock('@react-native-community/netinfo', () => {
  const actual = jest.requireActual('@react-native-community/netinfo');
  return { ...actual, useNetInfo: jest.fn() };
});

const mockUseNetInfo = useNetInfo as jest.MockedFunction<typeof useNetInfo>;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockCanGoBack = false;

jest.mock('expo-router', () => {
  const { Text } = jest.requireActual('react-native');
  return {
    router: {
      push: (href: unknown) => mockPush(href),
      back: jest.fn(),
      replace: (href: unknown) => mockReplace(href),
    },
    useCanGoBack: () => mockCanGoBack,
    Link: ({ children }: { children: ReactNode }) => children,
    Redirect: ({ href }: { href: unknown }) => (
      <Text>{`redirect:${String(href)}`}</Text>
    ),
  };
});

const online: NetInfoState = {
  type: NetInfoStateType.other,
  isConnected: true,
  isInternetReachable: true,
  details: { isConnectionExpensive: false },
};

function makeLine(
  id: number,
  product: Partial<CartLine['product']> & { id: number; name: string },
  overrides: Partial<CartLine> = {},
): CartLine {
  return {
    id,
    units: overrides.units ?? 1,
    size_id: null,
    color_id: null,
    isCustom: overrides.isCustom ?? '0',
    available_id: null,
    product: {
      price: 20000,
      old_price: null,
      units: 10,
      status: 'approved',
      isMakeup: false,
      thrift: false,
      media: [],
      sizes: [],
      colours: [],
      ...product,
    },
  };
}

function getCart(lines: CartLine[]) {
  return http.post(`${API_URL}/getCart`, () =>
    HttpResponse.json({ status: true, message: 'ok', data: lines }),
  );
}

describe('CartScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearSession();
    mockUseNetInfo.mockReturnValue(online);
  });

  it('renders a populated cart with an estimated subtotal and checkout', async () => {
    setSession({ token: 't', userId: 1 });
    server.use(
      getCart([makeLine(738, { id: 243, name: 'Hoodie', price: 20000 })]),
    );

    await render(<CartScreen />);

    expect(await screen.findByText('Hoodie')).toBeOnTheScreen();
    expect(screen.getByText('Estimated')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Checkout' })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Checkout' }));
    expect(mockPush).toHaveBeenCalledWith('/checkout');
  });

  it('shows excluded lines with their reason', async () => {
    setSession({ token: 't', userId: 1 });
    server.use(
      getCart([
        makeLine(739, { id: 244, name: 'Free tote', price: 0 }),
        makeLine(740, { id: 245, name: 'Makeup service', isMakeup: true }),
      ]),
    );

    await render(<CartScreen />);

    expect(await screen.findByText('Free tote')).toBeOnTheScreen();
    expect(screen.getByText('Free item:')).toBeOnTheScreen();
    expect(
      screen.getByRole('link', { name: 'claim it from its page' }),
    ).toBeOnTheScreen();
    expect(screen.getByText('Makeup service')).toBeOnTheScreen();
    expect(screen.getAllByText('Not available in this version')).toHaveLength(
      1,
    );
    expect(
      screen.queryByRole('button', { name: 'Increase quantity' }),
    ).toBeNull();
  });

  it('removes a line after a destructive confirmation', async () => {
    setSession({ token: 't', userId: 1 });
    let removed = false;
    server.use(
      http.post(`${API_URL}/getCart`, () =>
        HttpResponse.json({
          status: true,
          message: 'ok',
          data: removed ? [] : [makeLine(738, { id: 243, name: 'Hoodie' })],
        }),
      ),
      removeFromCartSuccess,
    );

    await render(<CartScreen />);
    await screen.findByText('Hoodie');

    await fireEvent.press(
      screen.getByRole('button', { name: 'Remove Hoodie' }),
    );
    expect(screen.getByText('Remove item?')).toBeOnTheScreen();

    removed = true;
    await fireEvent.press(screen.getByRole('button', { name: 'Remove' }));

    expect(await screen.findByText('Your cart is empty')).toBeOnTheScreen();
  });

  it('shows parseable lines and reports failed lines instead of empty', async () => {
    setSession({ token: 't', userId: 1 });
    server.use(
      http.post(`${API_URL}/getCart`, () =>
        HttpResponse.json({
          status: true,
          message: 'ok',
          data: [
            makeLine(738, { id: 243, name: 'Hoodie' }),
            { id: 'bad-line' },
          ],
        }),
      ),
    );

    await render(<CartScreen />);

    expect(await screen.findByText('Hoodie')).toBeOnTheScreen();
    expect(screen.getByText("1 item couldn't be loaded")).toBeOnTheScreen();
    expect(screen.queryByText('Your cart is empty')).toBeNull();
  });

  it('redirects a guest to login', async () => {
    await render(<CartScreen />);

    expect(
      screen.getByText('redirect:/login?redirectTo=%2Fcart'),
    ).toBeOnTheScreen();
  });

  it('shows a loading state instead of empty while the signed-in user id is unresolved', async () => {
    setSession({ token: 't', userId: null });

    await render(<CartScreen />);

    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
    expect(screen.queryByText('Your cart is empty')).toBeNull();
    expect(screen.queryByText(/redirect:/)).toBeNull();
  });
});
