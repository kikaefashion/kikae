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
    expect(flattened.fontWeight).toBe(700);
  });
});
