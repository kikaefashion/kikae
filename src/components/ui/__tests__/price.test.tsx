import { StyleSheet } from 'react-native';

import { render, screen } from '@/test-utils/render';

import { Price } from '../price';

describe('Price', () => {
  it('formats naira with thousands separators', async () => {
    await render(<Price amount={1500} />);
    expect(screen.getByText('₦1,500')).toBeOnTheScreen();
  });

  it('bolds for emphasis', async () => {
    await render(<Price amount={1500} emphasis />);
    const flattened = StyleSheet.flatten(
      screen.getByText('₦1,500').props.style,
    );
    expect(flattened.fontWeight).toBe(700);
  });
});
