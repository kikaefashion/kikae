import { fireEvent, render, screen } from '@/test-utils/render';

import { Button } from '../button';

describe('Button', () => {
  it('renders its label and fires onPress', async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Save</Button>);
    expect(screen.getByText('Save')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('announces disabled and blocks presses', async () => {
    const onPress = jest.fn();
    await render(
      <Button disabled onPress={onPress}>
        Save
      </Button>,
    );
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it('announces loading, blocks presses, and keeps the label', async () => {
    const onPress = jest.fn();
    await render(
      <Button loading onPress={onPress}>
        Save
      </Button>,
    );
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({
      busy: true,
      disabled: true,
    });
    expect(screen.getByText('Save')).toBeOnTheScreen();
  });

  it('renders every variant', async () => {
    const variants = ['primary', 'secondary', 'text', 'danger'] as const;
    for (const variant of variants) {
      const { unmount } = await render(
        <Button variant={variant}>Label</Button>,
      );
      expect(screen.getByText('Label')).toBeOnTheScreen();
      await unmount();
    }
  });

  it('renders a leading icon', async () => {
    await render(<Button icon="cart">Add to cart</Button>);
    expect(screen.getByText('Add to cart')).toBeOnTheScreen();
  });
});
