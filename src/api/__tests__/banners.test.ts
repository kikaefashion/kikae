import {
  getBannersStatusFalse,
  getBannersSuccess,
} from '@/test-utils/msw/handlers';
import { server } from '@/test-utils/msw/server';

import { BannerSchema, fetchBanners, sortBanners } from '../endpoints/banners';

describe('BannerSchema', () => {
  it('declares only the rendered fields and drops timestamps', () => {
    const parsed = BannerSchema.parse({
      id: 1,
      title: 'Makeup',
      text: 'View Makeup services',
      file: 'profile-pic/x.webp',
      position: '1',
      url: '/',
      created_at: '2026-02-26T23:30:30.000000Z',
      updated_at: '2026-03-17T21:14:14.000000Z',
    });

    expect(parsed).toEqual({
      id: 1,
      title: 'Makeup',
      text: 'View Makeup services',
      file: 'profile-pic/x.webp',
      position: 1,
      url: '/',
    });
    expect('created_at' in parsed).toBe(false);
  });
});

describe('sortBanners', () => {
  it('orders banners by position', () => {
    const sorted = sortBanners([
      { id: 3, title: 'Stores', text: '', file: '', position: 2, url: '/stores' },
      { id: 1, title: 'Makeup', text: '', file: '', position: 1, url: '/' },
    ]);

    expect(sorted.map((b) => b.id)).toEqual([1, 3]);
  });
});

describe('fetchBanners', () => {
  it('returns the banner list', async () => {
    server.use(getBannersSuccess);
    const data = await fetchBanners();
    expect(data).toHaveLength(3);
    expect(data[0].title).toBe('Stores');
  });

  it('treats a false status as an error', async () => {
    server.use(getBannersStatusFalse);
    await expect(fetchBanners()).rejects.toMatchObject({ kind: 'api' });
  });
});
