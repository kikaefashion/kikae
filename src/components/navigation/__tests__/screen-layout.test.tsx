import { render, screen } from '@/test-utils/render';

import { Text } from '@/components/ui/text';

import { ComingSoonScreen, ScreenLayout } from '../screen-layout';

describe('ScreenLayout', () => {
  it('renders children within the scrollable content area', async () => {
    await render(
      <ScreenLayout>
        <Text>Content</Text>
      </ScreenLayout>,
    );
    expect(screen.getByText('Content')).toBeOnTheScreen();
  });
});

describe('ComingSoonScreen', () => {
  it('renders the title and a coming-soon empty state', async () => {
    await render(<ComingSoonScreen title="Discover" />);
    expect(screen.getByText('Discover')).toBeOnTheScreen();
    expect(screen.getByText('Coming soon')).toBeOnTheScreen();
  });
});
