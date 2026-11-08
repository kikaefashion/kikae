import { AccessibilityInfo } from 'react-native';

import { fireEvent, render, screen, waitFor } from '@/test-utils/render';

import { Carousel, type CarouselSlide } from '../carousel';

jest.mock('expo-router', () => ({
  useIsFocused: () => true,
}));

const mockReduceMotion = AccessibilityInfo.isReduceMotionEnabled as jest.Mock;

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: 'Makeup',
    text: 'View Makeup services',
    imageUrl: 'https://media.test/makeup.webp',
    href: '/makeup',
  },
  {
    id: 3,
    title: 'Stores',
    text: 'View Various Stores',
    imageUrl: 'https://media.test/stores.webp',
    href: '/stores',
  },
  {
    id: 4,
    title: 'External',
    text: 'Not tappable',
    imageUrl: 'https://media.test/ext.webp',
    href: null,
  },
];

describe('Carousel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion.mockResolvedValue(false);
  });

  it('renders slides with title and text', async () => {
    await render(<Carousel slides={slides} onSlidePress={jest.fn()} />);
    expect(screen.getByText('Makeup')).toBeOnTheScreen();
    expect(screen.getByText('View Various Stores')).toBeOnTheScreen();
  });

  it('labels dots and marks the active slide', async () => {
    await render(<Carousel slides={slides} onSlidePress={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Slide 1 of 3' }).props
        .accessibilityState,
    ).toMatchObject({ selected: true });
    expect(
      screen.getByRole('button', { name: 'Slide 2 of 3' }).props
        .accessibilityState,
    ).toMatchObject({ selected: false });
  });

  it('navigates with prev/next', async () => {
    await render(<Carousel slides={slides} onSlidePress={jest.fn()} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Next slide' }));
    expect(
      screen.getByRole('button', { name: 'Slide 2 of 3' }).props
        .accessibilityState,
    ).toMatchObject({ selected: true });

    await fireEvent.press(
      screen.getByRole('button', { name: 'Previous slide' }),
    );
    expect(
      screen.getByRole('button', { name: 'Slide 1 of 3' }).props
        .accessibilityState,
    ).toMatchObject({ selected: true });
  });

  it('shows a pause/play button and toggles it', async () => {
    await render(<Carousel slides={slides} onSlidePress={jest.fn()} />);

    await fireEvent.press(
      await screen.findByRole('button', { name: 'Pause autoplay' }),
    );
    expect(
      screen.getByRole('button', { name: 'Play autoplay' }),
    ).toBeOnTheScreen();
  });

  it('hides autoplay under reduced motion', async () => {
    mockReduceMotion.mockResolvedValue(true);
    await render(<Carousel slides={slides} onSlidePress={jest.fn()} />);

    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Pause autoplay' }),
      ).toBeNull(),
    );
    expect(
      screen.queryByRole('button', { name: 'Play autoplay' }),
    ).toBeNull();
  });

  it('does not make a non-whitelisted slide tappable', async () => {
    await render(<Carousel slides={slides} onSlidePress={jest.fn()} />);
    expect(screen.queryByRole('link', { name: 'External' })).toBeNull();
  });

  it('fires onSlidePress for a tappable slide', async () => {
    const onSlidePress = jest.fn();
    await render(<Carousel slides={slides} onSlidePress={onSlidePress} />);

    await fireEvent.press(screen.getByRole('link', { name: 'Makeup' }));
    expect(onSlidePress).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }),
    );
  });
});
