import { renderHook } from '@/test-utils/render';

import { useDesktopLayout } from '../layout';

const mockUseWindowDimensions = jest.fn(() => ({
  width: 1024,
  height: 800,
  scale: 2,
  fontScale: 2,
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => mockUseWindowDimensions(),
}));

describe('useDesktopLayout', () => {
  it.each([
    [1023, false],
    [1024, true],
  ] as const)('is %s at width %i', async (width, expected) => {
    mockUseWindowDimensions.mockReturnValue({
      width,
      height: 800,
      scale: 2,
      fontScale: 2,
    });

    const { result } = await renderHook(() => useDesktopLayout());

    expect(result.current).toBe(expected);
  });
});
