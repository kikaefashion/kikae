import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createQueryClient } from '@/api/query-client';
import { ToastProvider } from '@/components/ui/toast';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { restoreSession } from '@/session/session-store';

/**
 * App-wide providers: SafeArea, React Query, and the navigation color scheme
 * (defaulting to the system scheme). Hydrates the session at startup; the root
 * layout holds the splash screen until hydration resolves. No visible UI.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => createQueryClient(), []);
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    void restoreSession().finally(() => {
      void SplashScreen.hideAsync();
    });
  }, []);

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
