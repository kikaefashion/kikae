import { fireEvent, render, screen } from '@/test-utils/render';

import { Chip } from '../chip';

describe('Chip', () => {
  it('exposes filter state as selected', async () => {
    const onPress = jest.fn();
    await render(
      <Chip role="filter" label="In stock" selected onPress={onPress} />,
    );
    const chip = screen.getByRole('button');
    expect(chip.props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(chip);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('exposes tab state via aria-selected', async () => {
    await render(<Chip role="tab" label="Products" selected />);
    expect(screen.getByRole('tab').props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it('uses the link role for categories', async () => {
    await render(<Chip role="category" label="Fashion" />);
    expect(screen.getByRole('link')).toBeOnTheScreen();
    expect(screen.getByText('Fashion')).toBeOnTheScreen();
  });

  it('blocks presses when disabled', async () => {
    const onPress = jest.fn();
    await render(
      <Chip role="filter" label="In stock" disabled onPress={onPress} />,
    );
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
