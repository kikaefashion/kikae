import type { ReactElement } from 'react';
import { View } from 'react-native';

import { render, screen } from '@/test-utils/render';

import { Gallery } from '../gallery';

// Render list items inline so the no-layout Jest renderer never spins up
// `VirtualizedList` timers.
function mockFlatList({
  data = [],
  renderItem,
}: {
  data?: readonly unknown[];
  renderItem: (info: { item: unknown; index: number }) => ReactElement | null;
}) {
  return (
    <View>
      {data.map((item, index) => (
        <View key={index}>{renderItem({ item, index })}</View>
      ))}
    </View>
  );
}

jest.mock('react-native/Libraries/Lists/FlatList', () => ({
  __esModule: true,
  default: mockFlatList,
}));

describe('Gallery', () => {
  it('renders a placeholder when there are no images', async () => {
    await render(<Gallery images={[]} alt="Dress" />);
    expect(
      screen.getByRole('image', { name: 'Dress unavailable' }),
    ).toBeOnTheScreen();
  });

  it('renders the pager with labelled dots and prev/next buttons', async () => {
    await render(
      <Gallery images={[{ url: 'a.webp' }, { url: 'b.webp' }]} alt="Dress" />,
    );

    expect(
      screen.getByRole('button', { name: 'Image 1 of 2' }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Image 2 of 2' }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Previous image' }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Next image' }),
    ).toBeOnTheScreen();
  });

  it('hides the dots and prev/next buttons when there is one image', async () => {
    await render(<Gallery images={[{ url: 'a.webp' }]} alt="Dress" />);

    expect(screen.getByLabelText('Dress image 1 of 1')).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'Previous image' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Next image' })).toBeNull();
  });
});
