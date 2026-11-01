import { fireEvent, render, screen } from '@/test-utils/render';

import { Input } from '../input';

describe('Input', () => {
  it('associates its label and passes placeholder', async () => {
    await render(<Input label="Email" placeholder="you@example.com" />);
    const field = screen.getByLabelText('Email');
    expect(field.props.placeholder).toBe('you@example.com');
  });

  it('shows a helper message', async () => {
    await render(<Input label="Email" helper="We will not share this" />);
    expect(screen.getByText('We will not share this')).toBeOnTheScreen();
  });

  it('shows and announces an error message', async () => {
    await render(<Input label="Email" error="Required" />);
    const message = screen.getByText('Required');
    expect(message.props.accessibilityLiveRegion).toBe('polite');
  });

  it('announces the disabled state and blocks editing', async () => {
    await render(<Input label="Email" editable={false} />);
    const field = screen.getByLabelText('Email');
    expect(field.props.editable).toBe(false);
    expect(field.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('accepts typed input', async () => {
    const onChangeText = jest.fn();
    await render(<Input label="Email" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByLabelText('Email'), 'a@b.c');
    expect(onChangeText).toHaveBeenCalledWith('a@b.c');
  });
});
