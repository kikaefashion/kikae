import { fireEvent, render, screen } from '@/test-utils/render';

import { SectionHeader } from '../section-header';

describe('SectionHeader', () => {
  it('renders the title as a heading', async () => {
    await render(<SectionHeader title="New in" />);
    expect(screen.getByRole('header', { name: 'New in' })).toBeOnTheScreen();
  });

  it('renders a trailing action and fires its handler', async () => {
    const onActionPress = jest.fn();
    await render(
      <SectionHeader title="New in" actionLabel="See all" onActionPress={onActionPress} />,
    );
    const action = screen.getByRole('button', { name: 'See all' });
    expect(action).toBeOnTheScreen();
    await fireEvent.press(action);
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });

  it('hides the action when no handler is provided', async () => {
    await render(<SectionHeader title="New in" actionLabel="See all" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
