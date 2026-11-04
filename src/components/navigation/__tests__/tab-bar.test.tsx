import { render, screen } from '@/test-utils/render';

import { TabBar, TabItem } from '../tab-bar';

const ENTRIES = [
  { label: 'Home', icon: 'home', iconOutline: 'home-outline' },
  { label: 'Discover', icon: 'compass', iconOutline: 'compass-outline' },
  { label: 'Runway', icon: 'play-circle', iconOutline: 'play-circle-outline' },
  { label: 'Makeup', icon: 'sparkles', iconOutline: 'sparkles-outline' },
  { label: 'Profile', icon: 'person', iconOutline: 'person-outline' },
] as const;

function renderTabBar(isDesktop: boolean) {
  return render(
    <TabBar isDesktop={isDesktop}>
      {ENTRIES.map((entry, index) => (
        <TabItem
          key={entry.label}
          label={entry.label}
          icon={entry.icon}
          iconOutline={entry.iconOutline}
          variant={isDesktop ? 'sidebar' : 'bottom'}
          isFocused={index === 0}
        />
      ))}
    </TabBar>,
  );
}

/** The `tablist` container is the direct parent of the tab entries. */
function getTabList() {
  return screen.getAllByRole('tab')[0].parent;
}

describe('TabBar', () => {
  it('renders the five entries with tab roles and selected state', async () => {
    await renderTabBar(false);

    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(getTabList()?.props.accessibilityRole).toBe('tablist');

    expect(
      screen.getByRole('tab', { name: 'Home' }).props.accessibilityState,
    ).toMatchObject({ selected: true });
    expect(
      screen.getByRole('tab', { name: 'Discover' }).props.accessibilityState,
    ).toMatchObject({ selected: false });
  });

  it('renders a bottom bar below the desktop breakpoint', async () => {
    await renderTabBar(false);
    expect(getTabList()).toHaveStyle({ flexDirection: 'row' });
  });

  it('renders a fixed sidebar at the desktop breakpoint', async () => {
    await renderTabBar(true);
    expect(getTabList()).toHaveStyle({
      position: 'absolute',
      width: 256,
    });
  });
});
