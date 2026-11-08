import { StyleSheet } from 'react-native';

import { render, screen } from '@/test-utils/render';

import { Text } from '../text';

describe('Text', () => {
  it('renders its children', async () => {
    await render(<Text>Hello</Text>);
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });

  it('caps large text at 200% by default', async () => {
    await render(<Text>Scalable</Text>);
    expect(screen.getByText('Scalable').props.maxFontSizeMultiplier).toBe(2);
  });

  it('applies a weight override', async () => {
    await render(<Text weight="bold">Bold</Text>);
    const flattened = StyleSheet.flatten(screen.getByText('Bold').props.style);
    expect(flattened.fontWeight).toBe('normal');
    expect(flattened.fontFamily).toBe('Poppins_700Bold');
  });

  it('resolves the family from the variant weight', async () => {
    await render(
      <>
        <Text variant="title-1">Bold variant</Text>
        <Text variant="title-2">Medium variant</Text>
        <Text variant="body">Regular variant</Text>
      </>,
    );

    const bold = StyleSheet.flatten(
      screen.getByText('Bold variant').props.style,
    );
    const medium = StyleSheet.flatten(
      screen.getByText('Medium variant').props.style,
    );
    const regular = StyleSheet.flatten(
      screen.getByText('Regular variant').props.style,
    );

    expect(bold.fontFamily).toBe('Poppins_700Bold');
    expect(medium.fontFamily).toBe('Poppins_500Medium');
    expect(regular.fontFamily).toBe('Poppins_400Regular');
  });
});
