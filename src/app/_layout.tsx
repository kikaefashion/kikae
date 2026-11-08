import '@/global.css';
import { Stack } from 'expo-router';
import { Head } from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useScheme } from '@/components/ui/colors';
import { APP_TITLE } from '@/config/titles';
import { resolveGuards } from '@/features/auth/guard';
import { AppProviders } from '@/providers/AppProviders';
import { useIsGuest, useSessionStatus } from '@/session/session-store';
import { roles } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

// Resolve deep links (e.g. "/") to the main tab group's initial route.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const canvas = roles[useScheme()].canvas;
  const status = useSessionStatus();
  const guest = useIsGuest();
  const { tabs, auth } = resolveGuards(status, guest);

  return (
    <AppProviders>
      <Head>
        <title>{APP_TITLE}</title>
      </Head>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: canvas },
        }}
      >
        <Stack.Protected guard={tabs} redirectTo="/login">
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={auth} redirectTo="/">
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Screen name="cart" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="design-system" />
      </Stack>
    </AppProviders>
  );
}
