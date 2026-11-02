import { fireEvent, render, screen } from '@/test-utils/render';

import { Radio } from '../radio';

describe('Radio', () => {
  it('toggles via its checked state', async () => {
    const onValueChange = jest.fn();
    await render(<Radio checked={false} onValueChange={onValueChange} />);
    await fireEvent.press(screen.getByRole('radio'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('announces its checked state', async () => {
    await render(<Radio checked onValueChange={() => {}} label="Standard" />);
    expect(screen.getByRole('radio').props.accessibilityState).toMatchObject({
      checked: true,
    });
    expect(screen.getByText('Standard')).toBeOnTheScreen();
  });

  it('blocks toggles when disabled', async () => {
    const onValueChange = jest.fn();
    await render(
      <Radio checked={false} disabled onValueChange={onValueChange} />,
    );
    await fireEvent.press(screen.getByRole('radio'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
