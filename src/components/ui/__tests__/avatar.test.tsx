import { render, screen } from '@/test-utils/render';

import { Avatar } from '../avatar';

describe('Avatar', () => {
  it('renders initials from the name', async () => {
    await render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByText('AL')).toBeOnTheScreen();
  });

  it('renders a neutral placeholder when empty', async () => {
    await render(<Avatar />);
    expect(screen.getByRole('image', { name: 'Avatar' })).toBeOnTheScreen();
  });

  it('prefers the image over initials', async () => {
    await render(
      <Avatar name="Ada Lovelace" imageUrl="https://example.com/a.png" />,
    );
    expect(screen.queryByText('AL')).toBeNull();
  });

  it('derives a single initial from a one-word name', async () => {
    await render(<Avatar name="Kikae" />);
    expect(screen.getByText('K')).toBeOnTheScreen();
  });
});
