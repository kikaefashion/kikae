import { fireEvent, render, screen } from '@/test-utils/render';

import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  it('toggles via its checked state', async () => {
    const onValueChange = jest.fn();
    await render(<Checkbox checked={false} onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('announces its checked state', async () => {
    await render(<Checkbox checked onValueChange={() => {}} label="Agree" />);
    expect(screen.getByRole('checkbox').props.accessibilityState).toMatchObject(
      {
        checked: true,
      },
    );
    expect(screen.getByText('Agree')).toBeOnTheScreen();
  });

  it('blocks toggles when disabled', async () => {
    const onValueChange = jest.fn();
    await render(
      <Checkbox checked={false} disabled onValueChange={onValueChange} />,
    );
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
