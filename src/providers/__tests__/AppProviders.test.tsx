import { Text } from 'react-native';

import { render, screen } from '@/test-utils/render';

import { AppProviders } from '../AppProviders';

jest.mock('@/session/session-store', () => ({
  restoreSession: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn().mockResolvedValue(true),
  preventAutoHideAsync: jest.fn(),
}));

describe('AppProviders', () => {
  it('renders its children inside the providers', async () => {
    await render(
      <AppProviders>
        <Text>child</Text>
      </AppProviders>,
    );

    expect(screen.getByText('child')).toBeOnTheScreen();
  });
});
