import { AccessibilityInfo, Pressable, Text } from 'react-native';

import { fireEvent, render, screen, waitFor } from '@/test-utils/render';

import { ToastProvider, useToast } from '../toast';

function Trigger() {
  const toast = useToast();
  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => toast.success('Saved')}
      >
        <Text>success</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => toast.error('Copy failed')}>
        <Text>error</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => toast.info('Heads up')}>
        <Text>info</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => toast.warning('Low stock')}
      >
        <Text>warning</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          toast.success('First');
          toast.success('Second');
        }}
      >
        <Text>two</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => toast.show('info', 'Short lived', 50)}
      >
        <Text>short</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => toast.dismiss()}>
        <Text>dismiss</Text>
      </Pressable>
    </>
  );
}

describe('Toast', () => {
  beforeEach(() => {
    jest
      .spyOn(AccessibilityInfo, 'announceForAccessibility')
      .mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a toast and announces it through a live region', async () => {
    await render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'success' }));
    expect(screen.getByText('Saved')).toBeOnTheScreen();
    expect(screen.getByRole('alert')).toBeOnTheScreen();
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
      'Saved',
    );
  });

  it.each([
    ['success', 'Saved'],
    ['error', 'Copy failed'],
    ['info', 'Heads up'],
    ['warning', 'Low stock'],
  ] as const)('renders the %s variant', async (variant, message) => {
    await render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await fireEvent.press(screen.getByRole('button', { name: variant }));
    expect(screen.getByText(message)).toBeOnTheScreen();
  });

  it('shows one toast at a time, replacing the previous one', async () => {
    await render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'two' }));
    expect(screen.queryByText('First')).not.toBeOnTheScreen();
    expect(screen.getByText('Second')).toBeOnTheScreen();
  });

  it('auto-dismisses after the duration', async () => {
    await render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'short' }));
    expect(screen.getByText('Short lived')).toBeOnTheScreen();
    await waitFor(
      () => expect(screen.queryByText('Short lived')).not.toBeOnTheScreen(),
      { timeout: 2000 },
    );
  });

  it('dismisses the current toast on demand', async () => {
    await render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'success' }));
    expect(screen.getByText('Saved')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'dismiss' }));
    expect(screen.queryByText('Saved')).not.toBeOnTheScreen();
  });
});
