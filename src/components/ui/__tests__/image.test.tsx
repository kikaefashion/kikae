import { fireEvent, render, screen } from '@/test-utils/render';

import { Image } from '../image';

describe('Image', () => {
  it('renders the image with its accessible name while loading', async () => {
    await render(<Image source="https://media.test/x.webp" alt="Shirt" />);
    expect(screen.getByLabelText('Shirt')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Shirt unavailable')).toBeNull();
  });

  it('uses memory and disk caching with cover fit', async () => {
    await render(<Image source="https://media.test/x.webp" alt="Shirt" />);
    const image = screen.getByLabelText('Shirt');
    expect(image.props.cachePolicy).toBe('memory-disk');
    expect(image.props.contentFit).toBe('cover');
  });

  it('shows an error fallback when there is no source', async () => {
    await render(<Image source={null} alt="Shirt" />);
    expect(
      screen.getByRole('image', { name: 'Shirt unavailable' }),
    ).toBeOnTheScreen();
  });

  it('switches to the error fallback on load failure', async () => {
    await render(<Image source="https://media.test/x.webp" alt="Shirt" />);
    await fireEvent(screen.getByLabelText('Shirt'), 'error');
    expect(
      screen.getByRole('image', { name: 'Shirt unavailable' }),
    ).toBeOnTheScreen();
    expect(screen.queryByLabelText('Shirt')).toBeNull();
  });
});
