import { renderHook } from '@/test-utils/render';
import { roles, semantic } from '@/theme/tokens';

import {
  textColorClasses,
  textColorHex,
  useScheme,
  useTextColor,
} from '../colors';

const mockUseColorScheme = jest.fn<string | null | undefined, []>();

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => mockUseColorScheme(),
}));

describe('colors', () => {
  afterEach(() => {
    mockUseColorScheme.mockReset();
  });

  it('maps text color tokens to NativeWind classes', () => {
    expect(textColorClasses.fg).toBe('text-fg');
    expect(textColorClasses['fg-muted']).toBe('text-fg-muted');
    expect(textColorClasses.error).toBe('text-error');
  });

  it('resolves role colors per scheme', () => {
    expect(textColorHex('light', 'fg')).toBe(roles.light.fg);
    expect(textColorHex('dark', 'fg')).toBe(roles.dark.fg);
    expect(textColorHex('dark', 'icon-muted')).toBe(roles.dark['icon-muted']);
  });

  it('resolves semantic colors per scheme', () => {
    expect(textColorHex('light', 'error')).toBe(semantic.light.error);
    expect(textColorHex('dark', 'success')).toBe(semantic.dark.success);
  });

  it('useScheme returns dark when the system prefers dark', async () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { result } = await renderHook(() => useScheme());
    expect(result.current).toBe('dark');
  });

  it('useScheme defaults to light', async () => {
    mockUseColorScheme.mockReturnValue(null);
    const { result } = await renderHook(() => useScheme());
    expect(result.current).toBe('light');
  });

  it('useTextColor resolves for the current scheme', async () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { result } = await renderHook(() => useTextColor('fg'));
    expect(result.current).toBe(roles.dark.fg);
  });
});
