import { Text } from 'react-native';

import { render, screen } from '@/test-utils/render';

import { AppProviders } from '../AppProviders';

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
