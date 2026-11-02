import { fireEvent, render, screen } from '@/test-utils/render';

import { Switch } from '../switch';

describe('Switch', () => {
  it('toggles via its checked state', async () => {
    const onValueChange = jest.fn();
    await render(<Switch checked={false} onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('announces its checked state and label', async () => {
    await render(
      <Switch checked onValueChange={() => {}} label="Push notifications" />,
    );
    expect(screen.getByRole('switch').props.accessibilityState).toMatchObject({
      checked: true,
    });
    expect(screen.getByText('Push notifications')).toBeOnTheScreen();
  });

  it('blocks toggles when disabled', async () => {
    const onValueChange = jest.fn();
    await render(
      <Switch checked={false} disabled onValueChange={onValueChange} />,
    );
    await fireEvent.press(screen.getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
