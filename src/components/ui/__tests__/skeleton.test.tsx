import { render } from '@/test-utils/render';

import { Skeleton, type SkeletonShape } from '../skeleton';

const shapes: SkeletonShape[] = [
  'text',
  'card',
  'row',
  'banner',
  'section-header',
];

describe('Skeleton', () => {
  it.each(shapes)('renders the %s shape', async (shape) => {
    const { getByRole } = await render(<Skeleton shape={shape} />);
    expect(getByRole('progressbar', { name: 'Loading' })).toBeOnTheScreen();
  });

  it('renders multiple text lines', async () => {
    const { getByRole } = await render(<Skeleton shape="text" lines={3} />);
    expect(getByRole('progressbar')).toBeOnTheScreen();
  });
});
