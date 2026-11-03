import { fireEvent, render, screen } from '@/test-utils/render';

import { InlineBanner, type InlineBannerStatus } from '../inline-banner';

describe('InlineBanner', () => {
  it('renders its label and announces as a live region', async () => {
    await render(<InlineBanner status="offline" label="You're offline" />);
    const label = screen.getByText("You're offline");
    expect(label).toBeOnTheScreen();
    expect(label.parent?.props.accessibilityLiveRegion).toBe('polite');
  });

  it.each(['offline', 'pending', 'error', 'info'] as InlineBannerStatus[])(
    'renders the %s status',
    async (status) => {
      await render(<InlineBanner status={status} label="Status" />);
      expect(screen.getByText('Status')).toBeOnTheScreen();
    },
  );

  it('renders an optional action and fires its callback', async () => {
    const onActionPress = jest.fn();
    await render(
      <InlineBanner
        status="offline"
        label="You're offline"
        actionLabel="Retry"
        onActionPress={onActionPress}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });
});
