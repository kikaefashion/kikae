import { mediaUrl } from '../media-url';

describe('mediaUrl', () => {
  it('prefixes relative paths with the media origin', () => {
    expect(mediaUrl('profile-pic/x.webp')).toBe(
      'https://media.test/profile-pic/x.webp',
    );
  });

  it('passes absolute URLs through unchanged', () => {
    expect(mediaUrl('https://cdn.example.com/x.webp')).toBe(
      'https://cdn.example.com/x.webp',
    );
  });

  it('returns null for empty values', () => {
    expect(mediaUrl(null)).toBeNull();
    expect(mediaUrl('')).toBeNull();
    expect(mediaUrl(undefined)).toBeNull();
  });

  it('strips leading slashes from relative paths', () => {
    expect(mediaUrl('/profile-pic/x.webp')).toBe(
      'https://media.test/profile-pic/x.webp',
    );
  });
});
