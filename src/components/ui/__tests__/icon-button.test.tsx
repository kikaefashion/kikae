import { fireEvent, render, screen } from '@/test-utils/render';

import { IconButton } from '../icon-button';

describe('IconButton', () => {
  it('is labelled and fires onPress', async () => {
    const onPress = jest.fn();
    await render(<IconButton icon="close" label="Close" onPress={onPress} />);
    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Close');
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('blocks presses when disabled', async () => {
    const onPress = jest.fn();
    await render(
      <IconButton icon="close" label="Close" disabled onPress={onPress} />,
    );
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });
});
