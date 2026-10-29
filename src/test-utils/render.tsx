import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  render as rtlRender,
  renderHook as rtlRenderHook,
  type RenderHookOptions,
} from '@testing-library/react-native';
import type { ReactElement, ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Safe-area metrics are not available from native code in Jest, so provide
// deterministic initial metrics so SafeAreaProvider renders its children.
const INITIAL_METRICS = {
  frame: { x: 0, y: 0, width: 320, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider initialMetrics={INITIAL_METRICS}>
      <QueryClientProvider client={createTestQueryClient()}>
        {children}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export function render(
  ui: ReactElement,
  options?: Parameters<typeof rtlRender>[1],
) {
  return rtlRender(ui, { wrapper: AllTheProviders, ...options });
}

export function renderHook<Result, Props>(
  callback: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'>,
) {
  return rtlRenderHook(callback, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react-native';
