import { Pressable, View } from 'react-native';

export interface ModalBackdropProps {
  /**
   * Tap-to-dismiss. Omit for destructive / non-dismissable dialogs so the
   * backdrop only blocks the page behind (components.md §5).
   */
  onPress?: () => void;
}

/**
 * Full-screen scrim behind a Dialog using the `modal-backdrop` token
 * (`rgba(0,0,0,0.5)`). Blocks the page behind; tappable only when a
 * non-destructive dismiss is allowed.
 */
export function ModalBackdrop({ onPress }: ModalBackdropProps) {
  if (!onPress) {
    return <View className="absolute inset-0 bg-modal-backdrop" />;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Dismiss"
      onPress={onPress}
      className="absolute inset-0 bg-modal-backdrop"
    />
  );
}
