import { fireEvent, render, screen } from '@/test-utils/render';

import { ErrorState } from '../error-state';

describe('ErrorState', () => {
  it('renders defaults and fires retry', async () => {
    const onRetry = jest.fn();
    await render(<ErrorState onRetry={onRetry} />);
    expect(screen.getByText('Something went wrong')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders custom copy and a last-updated cue', async () => {
    await render(
      <ErrorState
        title="Failed to load"
        message="Check your connection."
        retryLabel="Try again"
        lastUpdated="just now"
        onRetry={() => {}}
      />,
    );
    expect(screen.getByText('Failed to load')).toBeOnTheScreen();
    expect(screen.getByText('Check your connection.')).toBeOnTheScreen();
    expect(screen.getByText('Last updated just now')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeOnTheScreen();
  });
});
