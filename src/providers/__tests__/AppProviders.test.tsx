import { Text } from 'react-native';

import { render, screen, waitFor } from '@/test-utils/render';

import { AppProviders } from '../AppProviders';

const mockRestoreSession = jest.fn().mockResolvedValue(undefined);
const mockHideAsync = jest.fn().mockResolvedValue(true);
const mockUseFonts = jest.fn().mockReturnValue([true, null]);

jest.mock('@/session/session-store', () => ({
  restoreSession: () => mockRestoreSession(),
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: () => mockHideAsync(),
  preventAutoHideAsync: jest.fn(),
}));

jest.mock('expo-font', () => ({
  useFonts: () => mockUseFonts(),
  FontDisplay: { SWAP: 'swap' },
}));

describe('AppProviders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRestoreSession.mockResolvedValue(undefined);
    mockHideAsync.mockResolvedValue(true);
    mockUseFonts.mockReturnValue([true, null]);
  });

  it('renders its children inside the providers', async () => {
    await render(
      <AppProviders>
        <Text>child</Text>
      </AppProviders>,
    );

    expect(screen.getByText('child')).toBeOnTheScreen();
  });

  it('hides the splash once the session and fonts are ready', async () => {
    await render(
      <AppProviders>
        <Text>child</Text>
      </AppProviders>,
    );

    await waitFor(() => expect(mockHideAsync).toHaveBeenCalledTimes(1));
  });

  it('holds the splash while the fonts are still loading', async () => {
    mockUseFonts.mockReturnValue([false, null]);

    await render(
      <AppProviders>
        <Text>child</Text>
      </AppProviders>,
    );

    await waitFor(() => expect(mockRestoreSession).toHaveBeenCalled());
    expect(mockHideAsync).not.toHaveBeenCalled();
  });

  it('continues and hides the splash when the fonts fail to load', async () => {
    mockUseFonts.mockReturnValue([false, new Error('font load failed')]);

    await render(
      <AppProviders>
        <Text>child</Text>
      </AppProviders>,
    );

    await waitFor(() => expect(mockHideAsync).toHaveBeenCalledTimes(1));
  });
});
