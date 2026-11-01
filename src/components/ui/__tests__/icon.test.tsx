import { render } from '@/test-utils/render';

import { Icon } from '../icon';

describe('Icon', () => {
  it('renders a glyph', async () => {
    const view = await render(<Icon name="cart" />);
    expect(view.toJSON()).toBeTruthy();
  });

  it('supports decorative (hidden) icons', async () => {
    const view = await render(<Icon name="cart" aria-hidden />);
    expect(view.toJSON()).toBeTruthy();
  });
});
