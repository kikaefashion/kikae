import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { QueryClientProvider } from '@tanstack/react-query';
import { FontDisplay, useFonts, type FontSource } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createQueryClient } from '@/api/query-client';
import { ToastProvider } from '@/components/ui/toast';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { restoreSession } from '@/session/session-store';

/** Poppins 400/500/700 only — `display: swap` avoids invisible text on web. */
const POPPINS_FONTS: Record<string, FontSource> = {
  Poppins_400Regular: { uri: Poppins_400Regular, display: FontDisplay.SWAP },
  Poppins_500Medium: { uri: Poppins_500Medium, display: FontDisplay.SWAP },
  Poppins_700Bold: { uri: Poppins_700Bold, display: FontDisplay.SWAP },
};

/**
 * App-wide providers: SafeArea, React Query, and the navigation color scheme
 * (defaulting to the system scheme). Loads Poppins and hydrates the session at
 * startup; the root layout holds the splash screen until both are ready (fonts
 * fall back to the system stack if they fail). No visible UI.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => createQueryClient(), []);
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const [fontsLoaded, fontError] = useFonts(POPPINS_FONTS);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    void restoreSession().finally(() => setSessionReady(true));
  }, []);

  const fontsReady = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (sessionReady && fontsReady) {
      void SplashScreen.hideAsync();
    }
  }, [sessionReady, fontsReady]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>{children}</ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
