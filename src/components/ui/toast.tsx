import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccessibilityInfo, View } from 'react-native';

import { type TextColor } from '@/components/ui/colors';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

const variantIcon: Record<ToastVariant, IconName> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
  warning: 'warning',
};

const variantColor: Record<ToastVariant, TextColor> = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

/** Auto-dismiss within the 4–5s window (components.md §4). */
const DEFAULT_DURATION = 4500;

interface ToastMessage {
  id: number;
  variant: ToastVariant;
  message: string;
}

export interface ToastContextValue {
  show: (variant: ToastVariant, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  dismiss: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    clearTimer();
    setToast(null);
  }, [clearTimer]);

  const show = useCallback(
    (variant: ToastVariant, message: string, duration = DEFAULT_DURATION) => {
      clearTimer();
      idRef.current += 1;
      setToast({ id: idRef.current, variant, message });
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setToast(null);
      }, duration);
    },
    [clearTimer],
  );

  // Announce the message through a live region / screen reader.
  useEffect(() => {
    if (toast) {
      AccessibilityInfo.announceForAccessibility(toast.message);
    }
  }, [toast]);

  // Clear any pending timer on unmount so tests never leak a timeout.
  useEffect(() => clearTimer, [clearTimer]);

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message, duration) => show('success', message, duration),
      error: (message, duration) => show('error', message, duration),
      info: (message, duration) => show('info', message, duration),
      warning: (message, duration) => show('warning', message, duration),
      dismiss,
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastView toast={toast} />
    </ToastContext.Provider>
  );
}

function ToastView({ toast }: { toast: ToastMessage | null }) {
  if (!toast) return null;

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-0 items-center px-16 pb-16"
    >
      <View
        pointerEvents="none"
        accessible
        accessibilityRole="alert"
        accessibilityLiveRegion={
          toast.variant === 'error' ? 'assertive' : 'polite'
        }
        className="flex-row items-center gap-8 rounded-full border border-line bg-surface-overlay px-16 py-8"
      >
        <Icon
          name={variantIcon[toast.variant]}
          size={20}
          color={variantColor[toast.variant]}
          aria-hidden
        />
        <Text variant="callout" color="fg" maxFontSizeMultiplier={1.3}>
          {toast.message}
        </Text>
      </View>
    </View>
  );
}
