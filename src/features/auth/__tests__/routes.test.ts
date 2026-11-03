import { router } from 'expo-router';

import { routes } from '../routes';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

const mockReplace = router.replace as jest.MockedFunction<typeof router.replace>;

describe('routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to verify_email with the email pre-filled', () => {
    routes.verifyEmail('ada@example.com');

    expect(mockReplace).toHaveBeenCalledWith(
      '/verify_email?email=ada%40example.com',
    );
  });
});
