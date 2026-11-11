import { render, screen } from '@/test-utils/render';

import { TagList } from '../tag-list';

describe('TagList', () => {
  it('renders the label and each tag', async () => {
    await render(<TagList label="Available in sizes" values={['S', 'M']} />);
    expect(screen.getByText('Available in sizes')).toBeOnTheScreen();
    expect(screen.getByText('S')).toBeOnTheScreen();
    expect(screen.getByText('M')).toBeOnTheScreen();
  });

  it('renders nothing when there are no values', async () => {
    await render(<TagList label="Available in sizes" values={[]} />);
    expect(screen.queryByText('Available in sizes')).toBeNull();
  });
});
