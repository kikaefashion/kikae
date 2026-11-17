import { fireEvent, render, screen } from '@/test-utils/render';

import { Dialog } from '../dialog';

async function renderDialog(
  overrides: Partial<Parameters<typeof Dialog>[0]> = {},
) {
  const onClose = jest.fn();
  const onCancel = jest.fn();
  const onConfirm = jest.fn();
  await render(
    <Dialog
      visible
      onClose={onClose}
      label="Remove item"
      title="Remove item?"
      body="This can't be undone."
      destructive
      actions={[
        { label: 'Cancel', onPress: onCancel },
        { label: 'Remove', variant: 'danger', onPress: onConfirm },
      ]}
      {...overrides}
    />,
  );
  return { onClose, onCancel, onConfirm };
}

describe('Dialog', () => {
  it('renders a labelled title, body and actions', async () => {
    await renderDialog();

    expect(screen.getByLabelText('Remove item')).toBeOnTheScreen();
    expect(screen.getByText('Remove item?')).toBeOnTheScreen();
    expect(screen.getByText("This can't be undone.")).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeOnTheScreen();
  });

  it('uses the error accent icon for destructive dialogs', async () => {
    await renderDialog();
    expect(
      screen.getByText('alert-circle', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it('uses the notice icon for non-destructive dialogs', async () => {
    await renderDialog({ destructive: false });
    expect(
      screen.getByText('information-circle', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
  });

  it('fires the primary action', async () => {
    const { onConfirm } = await renderDialog();
    await fireEvent.press(screen.getByRole('button', { name: 'Remove' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('fires the secondary action', async () => {
    const { onCancel } = await renderDialog();
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when not visible', async () => {
    await renderDialog({ visible: false });
    expect(screen.queryByText('Remove item?')).toBeNull();
  });
});
