import {
  NetInfoStateType,
  useNetInfo,
  type NetInfoState,
} from '@react-native-community/netinfo';

import { fireEvent, render, renderHook, screen } from '@/test-utils/render';

import { OfflineState, useConnectivity } from '../offline-state';

jest.mock('@react-native-community/netinfo', () => {
  const actual = jest.requireActual('@react-native-community/netinfo');
  return { ...actual, useNetInfo: jest.fn() };
});

const mockUseNetInfo = useNetInfo as jest.MockedFunction<typeof useNetInfo>;

const offlineState: NetInfoState = {
  type: NetInfoStateType.none,
  isConnected: false,
  isInternetReachable: false,
  details: null,
};

describe('OfflineState', () => {
  beforeEach(() => {
    mockUseNetInfo.mockReset();
    mockUseNetInfo.mockReturnValue(offlineState);
  });

  it('renders the offline state and fires retry', async () => {
    const onRetry = jest.fn();
    await render(<OfflineState onRetry={onRetry} />);
    expect(screen.getByText("You're offline")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders a last-updated cue', async () => {
    await render(<OfflineState onRetry={() => {}} lastUpdated="2m ago" />);
    expect(screen.getByText('Last updated 2m ago')).toBeOnTheScreen();
  });

  it('hides itself when connectivity returns', async () => {
    await render(<OfflineState onRetry={() => {}} isConnected={true} />);
    expect(screen.queryByText("You're offline")).not.toBeOnTheScreen();
  });

  it('honors the isConnected override when offline', async () => {
    await render(<OfflineState onRetry={() => {}} isConnected={false} />);
    expect(screen.getByText("You're offline")).toBeOnTheScreen();
  });

  it('exposes connectivity from NetInfo', async () => {
    mockUseNetInfo.mockReturnValue(offlineState);
    const { result } = await renderHook(() => useConnectivity());
    expect(result.current.isConnected).toBe(false);
    expect(result.current.isInternetReachable).toBe(false);
  });
});
