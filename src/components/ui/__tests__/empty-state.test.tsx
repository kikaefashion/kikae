import { fireEvent, render, screen } from '@/test-utils/render';

import { EmptyState, type EmptyStateVariant } from '../empty-state';

describe('EmptyState', () => {
  it('renders a title and hint', async () => {
    await render(
      <EmptyState
        title="Nothing here yet"
        hint="Items you save will appear here."
      />,
    );
    expect(screen.getByText('Nothing here yet')).toBeOnTheScreen();
    expect(
      screen.getByText('Items you save will appear here.'),
    ).toBeOnTheScreen();
  });

  it.each(['default', 'no-results'] as EmptyStateVariant[])(
    'renders the %s variant',
    async (variant) => {
      await render(<EmptyState variant={variant} title="Empty" />);
      expect(screen.getByText('Empty')).toBeOnTheScreen();
    },
  );

  it('renders a default clear-filters action for no-results', async () => {
    const onActionPress = jest.fn();
    await render(
      <EmptyState
        variant="no-results"
        title="No results for shoes"
        onActionPress={onActionPress}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });

  it('renders a custom action label', async () => {
    const onActionPress = jest.fn();
    await render(
      <EmptyState
        title="Nothing here"
        actionLabel="Browse"
        onActionPress={onActionPress}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Browse' }));
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });
});
