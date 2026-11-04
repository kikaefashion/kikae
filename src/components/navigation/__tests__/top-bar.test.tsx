import { fireEvent, render, screen } from '@/test-utils/render';

import { TopBar } from '../top-bar';

const mockPush = jest.fn();
const mockUsePathname = jest.fn();
const mockUseSessionStatus = jest.fn();

jest.mock('expo-router', () => ({
  usePathname: () => mockUsePathname(),
  router: { push: (href: unknown) => mockPush(href) },
}));

jest.mock('@/session/session-store', () => ({
  useSessionStatus: () => mockUseSessionStatus(),
}));

describe('TopBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
    mockUseSessionStatus.mockReturnValue('signedIn');
  });

  it('renders the wordmark and labelled action buttons', async () => {
    await render(<TopBar />);

    expect(screen.getByText('Kikae')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Search' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Cart' })).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Notifications' }),
    ).toBeOnTheScreen();
  });

  it('hides the account entry on phone', async () => {
    await render(<TopBar />);
    expect(
      screen.queryByRole('button', { name: 'Account' }),
    ).not.toBeOnTheScreen();
  });

  it('shows the account entry on desktop', async () => {
    await render(<TopBar isDesktop />);
    expect(screen.getByRole('button', { name: 'Account' })).toBeOnTheScreen();
  });

  it('hides badges when counts are zero', async () => {
    await render(<TopBar />);
    expect(screen.queryByText('0')).not.toBeOnTheScreen();
  });

  it('shows badges when counts are above zero', async () => {
    await render(<TopBar cartCount={3} notificationCount={2} />);
    expect(screen.getByText('3')).toBeOnTheScreen();
    expect(screen.getByText('2')).toBeOnTheScreen();
  });

  it('navigates Search to the Discover tab', async () => {
    await render(<TopBar />);
    await fireEvent.press(screen.getByRole('button', { name: 'Search' }));
    expect(mockPush).toHaveBeenCalledWith('/discover');
  });

  it('routes signed-in users straight to a protected route', async () => {
    mockUsePathname.mockReturnValue('/discover');
    await render(<TopBar />);
    await fireEvent.press(screen.getByRole('button', { name: 'Cart' }));
    expect(mockPush).toHaveBeenCalledWith('/cart');
  });

  it('routes guests to login with a redirect back', async () => {
    mockUseSessionStatus.mockReturnValue('signedOut');
    mockUsePathname.mockReturnValue('/discover');
    await render(<TopBar />);
    await fireEvent.press(screen.getByRole('button', { name: 'Cart' }));
    expect(mockPush).toHaveBeenCalledWith('/login?redirectTo=%2Fdiscover');
  });
});
