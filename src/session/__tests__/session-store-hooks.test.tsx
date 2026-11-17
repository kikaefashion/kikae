import { Text, View } from 'react-native';

import { clearSession } from '@/api/identity';
import { Button } from '@/components/ui/button';
import { fireEvent, render, screen } from '@/test-utils/render';

import {
  persistSession,
  setGuest,
  useIsGuest,
  useSessionStatus,
  useUserId,
} from '../session-store';

jest.mock('../token-storage', () => ({
  tokenStorage: {
    getToken: jest.fn(),
    setToken: jest.fn(),
    removeToken: jest.fn(),
    getUserId: jest.fn(),
    setUserId: jest.fn(),
    removeUserId: jest.fn(),
  },
}));

function Harness() {
  const status = useSessionStatus();
  const guest = useIsGuest();
  const userId = useUserId();

  return (
    <View>
      <Text>status:{status}</Text>
      <Text>guest:{String(guest)}</Text>
      <Text>userId:{String(userId)}</Text>
      <Button onPress={() => void persistSession({ token: 't', userId: 42 })}>
        Sign in
      </Button>
      <Button onPress={() => setGuest(true)}>Set guest</Button>
    </View>
  );
}

describe('session-store hooks', () => {
  beforeEach(() => {
    clearSession();
    setGuest(false);
  });

  it('reflects sign-in, the resolved user id and the guest flag reactively', async () => {
    await render(<Harness />);

    expect(screen.getByText('status:signedOut')).toBeOnTheScreen();
    expect(screen.getByText('guest:false')).toBeOnTheScreen();
    expect(screen.getByText('userId:null')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('status:signedIn')).toBeOnTheScreen();
    expect(screen.getByText('userId:42')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Set guest' }));

    expect(screen.getByText('guest:true')).toBeOnTheScreen();
  });
});
