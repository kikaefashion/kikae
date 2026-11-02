import type { ElementRef } from 'react';
import { forwardRef } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { clsx } from 'tailwind-variants';

import { useTextColor, type TextColor } from '@/components/ui/colors';
import { focusRing } from '@/components/ui/constants';
import { Text } from '@/components/ui/text';

export interface InputProps extends TextInputProps {
  /** Static label rendered above the field (associated for a11y). */
  label?: string;
  /** Error message; takes precedence over `helper` and colors the border. */
  error?: string;
  /** Neutral hint text under the field. */
  helper?: string;
  /** Boxed variant (md radius + surface bg); default is an underline field. */
  boxed?: boolean;
}

/**
 * Labelled text field. Rest border = `line`, focus = `line-strong` + two-tone
 * ring, error = `error` border + message. Pass `textContentType` (native) and
 * `autoComplete` (web) via props for autofill.
 */
export const Input = forwardRef<ElementRef<typeof TextInput>, InputProps>(
  function Input(
    {
      label,
      error,
      helper,
      boxed = false,
      editable = true,
      className,
      ...props
    },
    ref,
  ) {
    const message = error ?? helper;
    const messageColor: TextColor = error ? 'error' : 'fg-muted';
    const placeholderColor = useTextColor('fg-placeholder');

    return (
      <View className={clsx('gap-8', className)}>
        {label ? (
          <Text variant="subhead" color="fg">
            {label}
          </Text>
        ) : null}

        <TextInput
          ref={ref}
          {...props}
          accessibilityLabel={label}
          accessibilityState={{ disabled: !editable }}
          editable={editable}
          placeholderTextColor={placeholderColor}
          className={clsx(
            'h-48 px-16 text-body text-fg',
            boxed ? 'rounded-md border bg-surface' : 'border-b',
            error ? 'border-error' : 'border-line focus:border-line-strong',
            !editable && 'border-line text-fg-disabled',
            focusRing,
          )}
        />

        {message ? (
          <Text
            variant="footnote"
            color={messageColor}
            accessibilityLiveRegion={error ? 'polite' : undefined}
          >
            {message}
          </Text>
        ) : null}
      </View>
    );
  },
);
