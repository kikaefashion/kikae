import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useMemo, type ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createQueryClient } from '@/api/query-client';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * App-wide providers: SafeArea, React Query, and the navigation color scheme
 * (defaulting to the system scheme). No visible UI.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => createQueryClient(), []);
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <SafeAreaProvider>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
