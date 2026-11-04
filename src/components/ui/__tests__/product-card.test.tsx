import type { ReactNode } from 'react';

import { fireEvent, render, screen } from '@/test-utils/render';

import { ProductCard, type ProductCardProduct } from '../product-card';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: ReactNode }) => children,
}));

const product: ProductCardProduct = {
  id: 1,
  name: 'Ankara dress',
  storeName: 'Ada Threads',
  price: 12000,
  oldPrice: 15000,
  units: 5,
  thrift: false,
  madeInNigeria: true,
  rating: 4.5,
  imageUrl: 'https://media.test/x.webp',
};

describe('ProductCard', () => {
  it('renders name, store, price and old price', async () => {
    await render(<ProductCard product={product} />);
    expect(screen.getByRole('link')).toBeOnTheScreen();
    expect(screen.getByText('Ankara dress')).toBeOnTheScreen();
    expect(screen.getByText('Ada Threads')).toBeOnTheScreen();
    expect(screen.getByText('₦12,000')).toBeOnTheScreen();
    expect(screen.getByText('₦15,000')).toBeOnTheScreen();
  });

  it('renders "Free" and no old price when price is zero', async () => {
    await render(
      <ProductCard product={{ ...product, price: 0, oldPrice: null }} />,
    );
    expect(screen.getByText('Free')).toBeOnTheScreen();
    expect(screen.queryByText('₦0')).toBeNull();
  });

  it('shows badges and hides them when unset', async () => {
    await render(
      <ProductCard product={{ ...product, thrift: true, madeInNigeria: false }} />,
    );
    expect(screen.getByText('Thrift')).toBeOnTheScreen();
    expect(screen.queryByText('Made in Nigeria')).toBeNull();
  });

  it('shows "Sold out" when units are zero and hides rating when null', async () => {
    await render(<ProductCard product={{ ...product, units: 0, rating: null }} />);
    expect(screen.getByText('Sold out')).toBeOnTheScreen();
    expect(screen.queryByText('4.5')).toBeNull();
  });

  it('labels the heart "Add to wishlist" and "Saved" once liked', async () => {
    const { rerender } = await render(<ProductCard product={product} />);
    expect(
      screen.getByRole('button', { name: 'Add to wishlist' }),
    ).toBeOnTheScreen();

    await rerender(<ProductCard product={product} liked />);
    const saved = screen.getByRole('button', { name: 'Saved' });
    expect(saved).toBeOnTheScreen();
    expect(saved.props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('fires the like handler and disables the heart while saving', async () => {
    const onLikePress = jest.fn();
    await render(<ProductCard product={product} saving onLikePress={onLikePress} />);
    const heart = screen.getByRole('button', { name: 'Add to wishlist' });
    expect(heart.props.accessibilityState).toMatchObject({ disabled: true });
    await fireEvent.press(heart);
    expect(onLikePress).not.toHaveBeenCalled();
  });
});
