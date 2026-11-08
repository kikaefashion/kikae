import { bannerHref, toCarouselSlide } from '../banner-links';

describe('bannerHref', () => {
  it('maps "/" to the Makeup tab', () => {
    expect(bannerHref('/')).toBe('/makeup');
  });

  it('maps /stores and /freebies to stub routes', () => {
    expect(bannerHref('/stores')).toBe('/stores');
    expect(bannerHref('/freebies')).toBe('/freebies');
  });

  it('returns null for any other value (shown but not tappable)', () => {
    expect(bannerHref('https://example.com')).toBeNull();
    expect(bannerHref('/unknown')).toBeNull();
  });
});

describe('toCarouselSlide', () => {
  it('maps a banner to a slide with a resolved image and href', () => {
    const slide = toCarouselSlide({
      id: 1,
      title: 'Makeup',
      text: 'View Makeup services',
      file: 'profile-pic/x.webp',
      position: 1,
      url: '/',
    });

    expect(slide).toEqual({
      id: 1,
      title: 'Makeup',
      text: 'View Makeup services',
      imageUrl: 'https://media.test/profile-pic/x.webp',
      href: '/makeup',
    });
  });
});
