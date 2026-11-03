import { render, screen } from '@/test-utils/render';

import { Loading, type LoadingSize } from '../loading';

describe('Loading', () => {
  it('renders as a progress indicator with the default label', async () => {
    await render(<Loading />);
    expect(
      screen.getByRole('progressbar', { name: 'Loading' }),
    ).toBeOnTheScreen();
  });

  it('announces a custom label', async () => {
    await render(<Loading label="Loading more items" />);
    expect(
      screen.getByRole('progressbar', { name: 'Loading more items' }),
    ).toBeOnTheScreen();
  });

  it.each(['sm', 'lg'] as LoadingSize[])('renders the %s size', async (size) => {
    await render(<Loading size={size} />);
    expect(screen.getByRole('progressbar')).toBeOnTheScreen();
  });
});
