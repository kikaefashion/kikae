import { queryKeys } from '../query-keys';
import { useCategories } from '../queries/use-categories';
import { useCurrentUser } from '../queries/use-current-user';

describe('query keys and hooks', () => {
  it('exposes the expected query keys', () => {
    expect(queryKeys.currentUser).toEqual(['currentUser']);
    expect(queryKeys.categories).toEqual(['categories']);
  });

  it('exports typed query hooks', () => {
    expect(typeof useCategories).toBe('function');
    expect(typeof useCurrentUser).toBe('function');
  });
});
