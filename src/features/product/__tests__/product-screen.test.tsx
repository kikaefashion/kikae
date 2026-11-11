import type { ReactElement, ReactNode } from 'react';
import {
  NetInfoStateType,
  useNetInfo,
  type NetInfoState,
} from '@react-native-community/netinfo';
import { http, HttpResponse } from 'msw';
import { View } from 'react-native';

import { clearSession, setSession } from '@/api/identity';
import {
  API_URL,
  getProductLoading,
  getProductNonApproved,
  getProductNotFound,
  getProductServerError,
  getProductSuccess,
  likeProductSuccess,
  productDetail,
  trackProductViewSuccess,
} from '@/test-utils/msw/handlers';
import { server } from '@/test-utils/msw/server';
import { fireEvent, render, screen } from '@/test-utils/render';

import { ProductScreen } from '../product-screen';

type MockFlatListProps = {
  data?: readonly unknown[];
  renderItem: (info: { item: unknown; index: number }) => ReactElement | null;
  keyExtractor?: (item: unknown, index: number) => string;
};

function mockFlatList({
  data = [],
  renderItem,
  keyExtractor,
}: MockFlatListProps) {
  return (
    <View>
      {data.map((item, index) => (
        <View key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem({ item, index })}
        </View>
      ))}
    </View>
  );
}

jest.mock('react-native/Libraries/Lists/FlatList', () => ({
  __esModule: true,
  default: mockFlatList,
}));

jest.mock('@react-native-community/netinfo', () => {
  const actual = jest.requireActual('@react-native-community/netinfo');
  return { ...actual, useNetInfo: jest.fn() };
});

const mockUseNetInfo = useNetInfo as jest.MockedFunction<typeof useNetInfo>;

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockCanGoBack = false;

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '248' }),
  usePathname: () => '/product/248',
  useCanGoBack: () => mockCanGoBack,
  router: {
    push: (href: unknown) => mockPush(href),
    back: jest.fn(),
    replace: (href: unknown) => mockReplace(href),
  },
  Link: ({ children }: { children: ReactNode }) => children,
}));

const online: NetInfoState = {
  type: NetInfoStateType.other,
  isConnected: true,
  isInternetReachable: true,
  details: { isConnectionExpensive: false },
};

const requestedUrls: string[] = [];

function trackRequests() {
  const listener = ({ request }: { request: Request }) => {
    requestedUrls.push(request.url);
  };
  server.events.on('request:start', listener);
  return () => server.events.removeListener('request:start', listener);
}

describe('ProductScreen', () => {
  let untrack: () => void;

  beforeEach(() => {
    jest.clearAllMocks();
    clearSession();
    mockCanGoBack = false;
    mockUseNetInfo.mockReturnValue(online);
    requestedUrls.length = 0;
    untrack = trackRequests();
    server.use(getProductSuccess, trackProductViewSuccess);
  });

  afterEach(() => {
    untrack();
  });

  it('renders the product and makes one product + one views request', async () => {
    await render(<ProductScreen />);
    expect(await screen.findByText('Test Makeup')).toBeOnTheScreen();
    expect(screen.getByText('₦15,000')).toBeOnTheScreen();
    expect(screen.getByText('Dexha Fashion')).toBeOnTheScreen();
    expect(screen.getByText('Ugbowo')).toBeOnTheScreen();

    const pathnames = requestedUrls.map((url) => new URL(url).pathname).sort();
    expect(pathnames).toEqual(['/getProduct/248', '/products/248/views']);
  });

  it('shows a skeleton while loading', async () => {
    server.use(getProductLoading, trackProductViewSuccess);
    await render(<ProductScreen />);
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  it('shows not-available on a 404', async () => {
    server.use(getProductNotFound, trackProductViewSuccess);
    await render(<ProductScreen />);
    expect(await screen.findByText('Product unavailable')).toBeOnTheScreen();
  });

  it('shows not-available for a non-approved product', async () => {
    server.use(getProductNonApproved, trackProductViewSuccess);
    await render(<ProductScreen />);
    expect(await screen.findByText('Product unavailable')).toBeOnTheScreen();
  });

  it('shows an error with Retry', async () => {
    server.use(getProductServerError, trackProductViewSuccess);
    await render(<ProductScreen />);
    expect(
      await screen.findByRole('button', { name: 'Retry' }),
    ).toBeOnTheScreen();
  });

  it('routes a guest heart tap to login', async () => {
    await render(<ProductScreen />);
    await screen.findByText('Test Makeup');

    fireEvent.press(screen.getByRole('button', { name: 'Add to wishlist' }));

    expect(mockPush).toHaveBeenCalledWith('/login?redirectTo=%2Fproduct%2F248');
    expect(requestedUrls.some((url) => url.includes('/likeProduct'))).toBe(
      false,
    );
    expect(
      screen.queryByText("Couldn't save to wishlist. Try again."),
    ).toBeNull();
  });

  it('renders the heart as Saved when the session id and like user_id differ in type', async () => {
    setSession({ token: 't', userId: 264 });
    server.use(
      http.get(`${API_URL}/getProduct/:id`, () =>
        HttpResponse.json({
          status: true,
          message: 'ok',
          data: { ...productDetail, likes: [{ user_id: '264', like: 1 }] },
        }),
      ),
      trackProductViewSuccess,
    );
    await render(<ProductScreen />);
    await screen.findByText('Test Makeup');

    expect(screen.getByRole('button', { name: 'Saved' })).toBeOnTheScreen();
  });

  it('shows Saved before the like request resolves', async () => {
    setSession({ token: 't', userId: 7 });
    server.use(
      getProductSuccess,
      trackProductViewSuccess,
      http.post(`${API_URL}/likeProduct`, () => new Promise(() => {})),
    );
    await render(<ProductScreen />);
    await screen.findByText('Test Makeup');

    fireEvent.press(screen.getByRole('button', { name: 'Add to wishlist' }));

    expect(
      await screen.findByRole('button', { name: 'Saved' }),
    ).toBeOnTheScreen();
  });

  it('saves the heart for a signed-in user', async () => {
    setSession({ token: 't', userId: 7 });
    server.use(getProductSuccess, trackProductViewSuccess, likeProductSuccess);
    await render(<ProductScreen />);
    await screen.findByText('Test Makeup');

    fireEvent.press(screen.getByRole('button', { name: 'Add to wishlist' }));

    expect(
      await screen.findByRole('button', { name: 'Saved' }),
    ).toBeOnTheScreen();
    expect(requestedUrls.some((url) => url.includes('/likeProduct'))).toBe(
      true,
    );
  });

  it('falls back to Home when the back button has no history', async () => {
    mockCanGoBack = false;
    await render(<ProductScreen />);
    await screen.findByText('Test Makeup');

    fireEvent.press(screen.getByRole('button', { name: 'Back' }));

    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
