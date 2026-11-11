import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fireEvent, render, screen } from '@/test-utils/render';

import { ScreenHeader } from '../screen-header';

const mockBack = jest.fn();
const mockReplace = jest.fn();
let mockCanGoBack = false;

jest.mock('expo-router', () => ({
  router: {
    back: () => mockBack(),
    replace: (href: unknown) => mockReplace(href),
  },
  useCanGoBack: () => mockCanGoBack,
}));

/** The header row is the grandparent of the labelled back button. */
function getHeader() {
  const header = screen.getByRole('button', { name: 'Back' }).parent?.parent;
  if (!header) throw new Error('ScreenHeader container not found');
  return header;
}

describe('ScreenHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack = false;
  });

  it('offsets itself below the top safe-area inset', async () => {
    await render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 320, height: 640 },
          insets: { top: 47, left: 0, right: 0, bottom: 0 },
        }}
      >
        <ScreenHeader title="Product" />
      </SafeAreaProvider>,
    );

    expect(getHeader()).toHaveStyle({ paddingTop: 55 });
  });

  it('renders the back button and an optional title', async () => {
    await render(<ScreenHeader title="Product" />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
    expect(screen.getByText('Product')).toBeOnTheScreen();
  });

  it('goes back when there is history', async () => {
    mockCanGoBack = true;
    await render(<ScreenHeader />);
    fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(mockBack).toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('falls back to Home when there is no history', async () => {
    mockCanGoBack = false;
    await render(<ScreenHeader />);
    fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(mockReplace).toHaveBeenCalledWith('/');
    expect(mockBack).not.toHaveBeenCalled();
  });
});
