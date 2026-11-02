import '@/global.css';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useScheme } from '@/components/ui/colors';
import { AppProviders } from '@/providers/AppProviders';
import { roles } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

// Resolve deep links (e.g. "/") to the main tab group's initial route.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const canvas = roles[useScheme()].canvas;

  return (
    <AppProviders>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: canvas },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="design-system" />
      </Stack>
    </AppProviders>
  );
}
