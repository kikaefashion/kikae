import { fireEvent, render, screen } from '@/test-utils/render';

import {
  freebieProduct,
  normalProduct,
  productDetail,
} from '@/test-utils/msw/handlers';

import { ProductActionArea, SizeColourPicker } from '../product-action-area';

import type { ProductDetail } from '@/api/endpoints/product';

async function renderActionArea(
  product: ProductDetail,
  overrides: Partial<Parameters<typeof ProductActionArea>[0]> = {},
) {
  const onAddToCart = jest.fn();
  const onGetForFree = jest.fn();
  const onQuantityChange = jest.fn();
  await render(
    <ProductActionArea
      product={product}
      quantity={1}
      remaining={product.units}
      pending={false}
      onQuantityChange={onQuantityChange}
      onAddToCart={onAddToCart}
      onGetForFree={onGetForFree}
      {...overrides}
    />,
  );
  return { onAddToCart, onGetForFree, onQuantityChange };
}

describe('ProductActionArea', () => {
  it('renders no bar for a makeup product', async () => {
    await renderActionArea(productDetail);
    expect(screen.queryByText('Add to cart')).toBeNull();
    expect(screen.queryByText('Get for free')).toBeNull();
  });

  it('renders the Add to cart bar and stepper for a normal product', async () => {
    const { onAddToCart } = await renderActionArea(normalProduct);

    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Increase quantity' }),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Add to cart' }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });

  it('renders "Get for free" for a freebie and never an Add to cart bar', async () => {
    const { onGetForFree } = await renderActionArea(freebieProduct);

    expect(screen.getByRole('button', { name: 'Get for free' })).toBeOnTheScreen();
    expect(screen.queryByText('Add to cart')).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'Get for free' }));
    expect(onGetForFree).toHaveBeenCalledTimes(1);
  });

  it('disables Add to cart when sold out', async () => {
    await renderActionArea({ ...normalProduct, units: 0 });
    expect(
      screen.getByRole('button', { name: 'Add to cart' }),
    ).toBeDisabled();
  });

  it('disables Add to cart when not approved', async () => {
    await renderActionArea({ ...normalProduct, status: 'rejected' });
    expect(
      screen.getByRole('button', { name: 'Add to cart' }),
    ).toBeDisabled();
  });
});

describe('SizeColourPicker', () => {
  it('renders single-select chips and reports selection', async () => {
    const onSizeChange = jest.fn();
    const onColorChange = jest.fn();
    await render(
      <SizeColourPicker
        sizes={normalProduct.sizes}
        colours={normalProduct.colours}
        sizeId={null}
        colorId={null}
        onSizeChange={onSizeChange}
        onColorChange={onColorChange}
        showSizeError={false}
        showColorError={false}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'S' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Red' }));

    expect(onSizeChange).toHaveBeenCalledWith(1);
    expect(onColorChange).toHaveBeenCalledWith(3);
  });

  it('shows the required-selection messages', async () => {
    await render(
      <SizeColourPicker
        sizes={normalProduct.sizes}
        colours={normalProduct.colours}
        sizeId={null}
        colorId={null}
        onSizeChange={jest.fn()}
        onColorChange={jest.fn()}
        showSizeError={true}
        showColorError={true}
      />,
    );

    expect(screen.getByText('Select a size')).toBeOnTheScreen();
    expect(screen.getByText('Select a colour')).toBeOnTheScreen();
  });
});