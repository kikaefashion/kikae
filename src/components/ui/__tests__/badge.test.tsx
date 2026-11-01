import { render, screen } from '@/test-utils/render';

import { Badge } from '../badge';

describe('Badge', () => {
  it('renders a count', async () => {
    await render(<Badge count={5} />);
    expect(screen.getByText('5')).toBeOnTheScreen();
  });

  it('caps the count at max+', async () => {
    await render(<Badge count={150} />);
    expect(screen.getByText('99+')).toBeOnTheScreen();
  });

  it('renders a status with icon and label', async () => {
    await render(
      <Badge status="success" icon="checkmark-circle" label="In stock" />,
    );
    expect(screen.getByText('In stock')).toBeOnTheScreen();
  });
});
