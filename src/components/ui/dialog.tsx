import { useEffect, useRef, type ElementRef } from 'react';
import { Modal, Platform, View } from 'react-native';

import { Button, type ButtonVariant } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { Text } from '@/components/ui/text';

export interface DialogAction {
  label: string;
  onPress: () => void;
  /** Defaults to `secondary`; a destructive dialog's confirm uses `danger`. */
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

export interface DialogProps {
  visible: boolean;
  /** Backdrop tap / Android back / Escape close handler. */
  onClose: () => void;
  /** Accessible name for the dialog (required — the dialog is labelled). */
  label: string;
  title: string;
  body?: string;
  /** Error accent + icon for confirmations of destructive actions. */
  destructive?: boolean;
  /** Icon override; defaults to a destructive/notice glyph. */
  icon?: IconName;
  /** Actions rendered right-aligned in order (last is the primary). */
  actions: DialogAction[];
  /** Backdrop tap-to-dismiss; default true unless destructive. */
  dismissable?: boolean;
}

/** Elements that can receive focus inside the trap (web). */
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Wrap focus within a container (web): keep Tab/Shift+Tab cycling through the
 * dialog's own controls so focus never escapes to the page behind.
 */
function trapTab(event: KeyboardEvent, container: HTMLElement | null): void {
  if (!container) return;
  const focusables = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  );
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || !container.contains(active)) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last || !container.contains(active)) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * Confirm dialog (components.md §5): title, body, primary + secondary actions.
 * Focus-trapped and Escape-closable on web with focus returned to the trigger;
 * `accessibilityViewIsModal` on iOS; destructive variant shows an `error`
 * accent + icon. Renders over a `ModalBackdrop` scrim.
 */
export function Dialog({
  visible,
  onClose,
  label,
  title,
  body,
  destructive = false,
  icon,
  actions,
  dismissable,
}: DialogProps) {
  const panelRef = useRef<ElementRef<typeof View> | null>(null);
  const canDismiss = dismissable ?? !destructive;

  // Focus trap + Escape close + focus restoration (web only).
  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current as unknown as HTMLElement | null;

    // Move focus into the dialog after the portal mounts.
    const focusTimer = setTimeout(() => {
      panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)[0]?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab') {
        trapTab(event, panel);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const defaultIcon: IconName = destructive
    ? 'alert-circle'
    : 'information-circle';

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...(Platform.OS === 'ios' ? { accessibilityViewIsModal: true } : {})}
    >
      <View className="flex-1 items-center justify-center p-24">
        <ModalBackdrop onPress={canDismiss ? onClose : undefined} />
        <View
          ref={panelRef}
          accessible
          accessibilityRole="alert"
          accessibilityLabel={label}
          className="w-full max-w-sm gap-12 rounded-2xl border border-line bg-surface-overlay p-24"
        >
          <View className="flex-row items-center gap-8">
            <Icon
              name={icon ?? defaultIcon}
              size={24}
              color={destructive ? 'error' : 'icon'}
              aria-hidden
            />
            <Text variant="title-3" color="fg" className="flex-1">
              {title}
            </Text>
          </View>

          {body ? (
            <Text variant="callout" color="fg-muted">
              {body}
            </Text>
          ) : null}

          <View className="flex-row justify-end gap-8 pt-8">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant ?? 'secondary'}
                size="sm"
                loading={action.loading}
                disabled={action.disabled}
                onPress={action.onPress}
              >
                {action.label}
              </Button>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
