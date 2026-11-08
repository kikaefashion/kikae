import type { ReactElement, ReactNode } from 'react';

import {
  NetInfoStateType,
  useNetInfo,
  type NetInfoState,
} from '@react-native-community/netinfo';
import { delay, http, HttpResponse } from 'msw';
import { AccessibilityInfo, View } from 'react-native';

import { clearSession, setSession } from '@/api/identity';
import {
  API_URL,
  getBannersEmpty,
  getBannersServerError,
  getHomeEmpty,
  getHomeOnlyNewArrivals,
  getHomeServerError,
  homeData,
  likeProductFailure,
  likeProductSuccess,
} from '@/test-utils/msw/handlers';
import { server } from '@/test-utils/msw/server';
import { fireEvent, render, screen } from '@/test-utils/render';

import { HomeScreen } from '../home-screen';

type MockFlatListProps = {
  data?: readonly unknown[];
  renderItem: (info: { item: unknown; index: number }) => ReactElement | null;
  keyExtractor?: (item: unknown, index: number) => string;
  numColumns?: number;
  horizontal?: boolean;
  ListHeaderComponent?: ReactElement | null;
  ListFooterComponent?: ReactElement | null;
};

// `VirtualizedList` schedules recurring 50ms timers in the no-layout Jest
// renderer, which keeps workers alive after the suite. Render items inline.
function mockFlatList({
  data = [],
  renderItem,
  keyExtractor,
  numColumns,
  horizontal,
  ListHeaderComponent,
  ListFooterComponent,
}: MockFlatListProps) {
  const items = data.map((item, index) => (
    <View key={keyExtractor ? keyExtractor(item, index) : index}>
      {renderItem({ item, index })}
    </View>
  ));

  return (
    <View>
      {ListHeaderComponent}
      <View
        style={
          horizontal
            ? { flexDirection: 'row' }
            : numColumns
              ? { flexDirection: 'row', flexWrap: 'wrap' }
              : undefined
        }
      >
        {items}
      </View>
      {ListFooterComponent}
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
jest.mock('expo-router', () => ({
  usePathname: () => '/',
  useIsFocused: () => true,
  router: { push: (href: unknown) => mockPush(href) },
  Link: ({ children }: { children: ReactNode }) => children,
}));

jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockReturnValue(
  undefined,
);

const online: NetInfoState = {
  type: NetInfoStateType.other,
  isConnected: true,
  isInternetReachable: true,
  details: { isConnectionExpensive: false },
};

const offline: NetInfoState = {
  type: NetInfoStateType.none,
  isConnected: false,
  isInternetReachable: false,
  details: null,
};

const requestedUrls: string[] = [];

function trackRequests() {
  const listener = ({ request }: { request: Request }) => {
    requestedUrls.push(request.url);
  };
  server.events.on('request:start', listener);
  return () => server.events.removeListener('request:start', listener);
}

describe('HomeScreen', () => {
  let untrack: () => void;

  beforeEach(() => {
    jest.clearAllMocks();
    requestedUrls.length = 0;
    mockUseNetInfo.mockReturnValue(online);
    untrack = trackRequests();
  });

  afterEach(() => {
    untrack();
    clearSession();
  });

  it('shows skeletons while loading', async () => {
    server.use(
      http.get(`${API_URL}/customer/v2/home`, async () => {
        await delay(50);
        return HttpResponse.json({ status: true, message: 'ok', data: homeData });
      }),
    );
    await render(<HomeScreen />);
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
    await screen.findAllByText('Ankara dress');
  });

  it('shows the error state with Retry on failure', async () => {
    server.use(getHomeServerError);
    await render(<HomeScreen />);
    expect(await screen.findByText('Something went wrong')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeOnTheScreen();
  });

  it('shows the empty state when every section is empty', async () => {
    server.use(getHomeEmpty);
    await render(<HomeScreen />);
    expect(await screen.findByText('Nothing here yet')).toBeOnTheScreen();
  });

  it('renders the carousel, chips, grid and rails from two responses', async () => {
    await render(<HomeScreen />);
    expect(await screen.findAllByText('Ankara dress')).not.toHaveLength(0);
    expect(screen.getByText('Makeup')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Home' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'New in' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Featured' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Thrift' })).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: 'Free' })).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'Fashion' })).toBeOnTheScreen();
    expect(screen.queryByRole('link', { name: 'Beauty' })).toBeNull();
  });

  it('navigates a chip tap to Discover with the category id', async () => {
    await render(<HomeScreen />);
    await screen.findAllByText('Ankara dress');

    await fireEvent.press(screen.getByRole('link', { name: 'Fashion' }));
    expect(mockPush).toHaveBeenCalledWith('/discover?categoryId=1');
  });

  it('makes exactly two requests on load (home + banners)', async () => {
    await render(<HomeScreen />);
    await screen.findAllByText('Ankara dress');

    const pathnames = requestedUrls.map((url) => new URL(url).pathname).sort();
    expect(pathnames).toEqual(['/banners/all', '/customer/v2/home']);
  });

  it('renders the home feed when banners fail', async () => {
    server.use(getBannersServerError);
    await render(<HomeScreen />);
    await screen.findAllByText('Ankara dress');

    expect(screen.queryByText('Makeup')).toBeNull();
    expect(screen.getByRole('header', { name: 'New in' })).toBeOnTheScreen();
  });

  it('renders the home feed when banners are empty', async () => {
    server.use(getBannersEmpty);
    await render(<HomeScreen />);
    await screen.findAllByText('Ankara dress');

    expect(screen.queryByText('Makeup')).toBeNull();
    expect(screen.getByRole('header', { name: 'New in' })).toBeOnTheScreen();
  });

  it('hides empty sections and never renders a vendor row', async () => {
    server.use(getHomeOnlyNewArrivals);
    await render(<HomeScreen />);
    await screen.findAllByText('Ankara dress');

    expect(screen.getByRole('header', { name: 'New in' })).toBeOnTheScreen();
    expect(screen.queryByRole('header', { name: 'Featured' })).toBeNull();
    expect(screen.queryByRole('header', { name: 'Thrift' })).toBeNull();
    expect(screen.queryByRole('header', { name: 'Free' })).toBeNull();
  });

  it('routes a guest heart tap to login without liking', async () => {
    await render(<HomeScreen />);
    await screen.findAllByText('Ankara dress');

    await fireEvent.press(
      screen.getAllByRole('button', { name: 'Add to wishlist' })[0],
    );

    expect(mockPush).toHaveBeenCalledWith('/login?redirectTo=%2F');
    expect(requestedUrls.some((url) => url.includes('/likeProduct'))).toBe(
      false,
    );
  });

  it('optimistically saves the heart for a signed-in user', async () => {
    setSession({ token: 't', userId: 7 });
    server.use(likeProductSuccess);
    await render(<HomeScreen />);
    await screen.findAllByText('Ankara dress');

    await fireEvent.press(
      screen.getAllByRole('button', { name: 'Add to wishlist' })[0],
    );

    expect(
      await screen.findAllByRole('button', { name: 'Saved' }),
    ).not.toHaveLength(0);
    expect(requestedUrls.some((url) => url.includes('/likeProduct'))).toBe(
      true,
    );
  });

  it('rolls back and toasts when the like fails', async () => {
    setSession({ token: 't', userId: 7 });
    server.use(likeProductFailure);
    await render(<HomeScreen />);
    await screen.findAllByText('Ankara dress');

    await fireEvent.press(
      screen.getAllByRole('button', { name: 'Add to wishlist' })[0],
    );

    expect(
      await screen.findByText("Couldn't save to wishlist. Try again."),
    ).toBeOnTheScreen();
    expect(screen.queryAllByRole('button', { name: 'Saved' })).toHaveLength(0);
  });

  it('shows an offline banner and keeps loaded data', async () => {
    mockUseNetInfo.mockReturnValue(offline);
    await render(<HomeScreen />);
    await screen.findAllByText('Ankara dress');

    expect(
      screen.getByText("You're offline — showing saved items"),
    ).toBeOnTheScreen();
  });
});
