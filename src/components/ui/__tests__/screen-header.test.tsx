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

describe('ScreenHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack = false;
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
