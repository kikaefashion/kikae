import { fireEvent, render, screen, waitFor } from '@/test-utils/render';
import { server } from '@/test-utils/msw/server';
import {
  getCurrentUserNetworkError,
  getCurrentUserSuccess,
  loginInvalid,
  loginNetworkError,
  loginSuccess,
  loginUnverified,
} from '@/test-utils/msw/handlers';

import {
  persistSession,
  setGuest,
  setSessionUserId,
} from '@/session/session-store';

import { LoginScreen } from '../login-screen';

const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@/session/session-store', () => ({
  persistSession: jest.fn().mockResolvedValue(undefined),
  setGuest: jest.fn(),
  setSessionUserId: jest.fn(),
}));

const mockPersistSession = persistSession as jest.MockedFunction<
  typeof persistSession
>;
const mockSetGuest = setGuest as jest.MockedFunction<typeof setGuest>;
const mockSetSessionUserId = setSessionUserId as jest.MockedFunction<
  typeof setSessionUserId
>;

async function fillAndSubmit(email: string, password: string) {
  await fireEvent.changeText(screen.getByLabelText('Email'), email);
  await fireEvent.changeText(screen.getByLabelText('Password'), password);
  await fireEvent.press(screen.getByRole('button', { name: 'Login' }));
}

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({});
  });

  it('shows inline errors and makes no request on empty submit', async () => {
    await render(<LoginScreen />);
    await fireEvent.press(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Email is required')).toBeOnTheScreen();
    expect(screen.getByText('Password is required')).toBeOnTheScreen();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockPersistSession).not.toHaveBeenCalled();
  });

  it('does not auto-focus the email field on native', async () => {
    await render(<LoginScreen />);
    expect(screen.getByLabelText('Email').props.autoFocus).toBe(false);
  });

  it('stores the token, loads the user and navigates to redirectTo', async () => {
    server.use(loginSuccess);
    mockUseLocalSearchParams.mockReturnValue({ redirectTo: '/cart' });

    await render(<LoginScreen />);
    await fillAndSubmit('ada@example.com', 'password');

    await waitFor(() =>
      expect(mockPersistSession).toHaveBeenCalledWith({
        token: 'token-1',
        userId: null,
      }),
    );
    await waitFor(() => expect(mockSetSessionUserId).toHaveBeenCalledWith(1));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/cart'));
  });

  it('shows the generic inline error on wrong password', async () => {
    server.use(loginInvalid);

    await render(<LoginScreen />);
    await fillAndSubmit('ada@example.com', 'wrong');

    expect(
      await screen.findByText('Incorrect email or password'),
    ).toBeOnTheScreen();
    expect(
      screen.queryByText('The credentials you provided could not be verified.'),
    ).not.toBeOnTheScreen();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockPersistSession).not.toHaveBeenCalled();
  });

  it('shows the message for an unverified account', async () => {
    server.use(loginUnverified);

    await render(<LoginScreen />);
    await fillAndSubmit('ada@example.com', 'password');

    expect(
      await screen.findByText(
        'Please verify your email address before logging in.',
      ),
    ).toBeOnTheScreen();
  });

  it('shows the offline banner and preserves typed values on network failure', async () => {
    server.use(loginNetworkError);

    await render(<LoginScreen />);
    await fillAndSubmit('ada@example.com', 'password');

    expect(
      await screen.findByText("You're offline — check your connection"),
    ).toBeOnTheScreen();
    expect(screen.getByDisplayValue('ada@example.com')).toBeOnTheScreen();
    expect(screen.getByDisplayValue('password')).toBeOnTheScreen();
  });

  it('retries the login from the offline banner', async () => {
    server.use(loginNetworkError);

    await render(<LoginScreen />);
    await fillAndSubmit('ada@example.com', 'password');
    expect(
      await screen.findByText("You're offline — check your connection"),
    ).toBeOnTheScreen();

    server.use(loginSuccess);
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() =>
      expect(mockPersistSession).toHaveBeenCalledWith({
        token: 'token-1',
        userId: null,
      }),
    );
  });

  it('keeps the token and shows a retry banner when currentUser fails', async () => {
    server.use(loginSuccess, getCurrentUserNetworkError);

    await render(<LoginScreen />);
    await fillAndSubmit('ada@example.com', 'password');

    await waitFor(() => expect(mockPersistSession).toHaveBeenCalled());
    expect(
      await screen.findByText("Couldn't load your profile."),
    ).toBeOnTheScreen();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('retries loading the user from the banner', async () => {
    server.use(loginSuccess, getCurrentUserNetworkError);

    await render(<LoginScreen />);
    await fillAndSubmit('ada@example.com', 'password');
    expect(
      await screen.findByText("Couldn't load your profile."),
    ).toBeOnTheScreen();

    server.use(getCurrentUserSuccess);
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(mockSetSessionUserId).toHaveBeenCalledWith(1));
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'));
  });

  it('continues as guest by setting the flag and navigating home', async () => {
    await render(<LoginScreen />);
    await fireEvent.press(
      screen.getByRole('button', { name: 'Continue as guest' }),
    );

    expect(mockSetGuest).toHaveBeenCalledWith(true);
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('announces the password toggle state', async () => {
    await render(<LoginScreen />);

    const show = screen.getByRole('button', { name: 'Show password' });
    expect(show).toBeOnTheScreen();
    await fireEvent.press(show);

    expect(
      screen.getByRole('button', { name: 'Hide password' }),
    ).toBeOnTheScreen();
  });
});
