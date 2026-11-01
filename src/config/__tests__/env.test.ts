import { parseEnv } from '../env';

const valid = {
  authBaseUrl: 'https://dev.kikae.com.ng',
  apiBaseUrl: 'https://dev.kikae.com.ng/api',
  mediaUrlPrefix: 'https://file-dev.kikae.com.ng/',
};

describe('parseEnv', () => {
  it('accepts valid http(s) URLs', () => {
    expect(parseEnv(valid)).toEqual(valid);
  });

  it('throws a clear error when a value is missing', () => {
    expect(() => parseEnv({ ...valid, apiBaseUrl: undefined })).toThrow(
      /Invalid environment configuration/,
    );
    expect(() => parseEnv({ ...valid, apiBaseUrl: undefined })).toThrow(
      /apiBaseUrl/,
    );
  });

  it('rejects non-URL values', () => {
    expect(() => parseEnv({ ...valid, authBaseUrl: 'not-a-url' })).toThrow(
      /Invalid environment configuration/,
    );
  });

  it('rejects non-http(s) schemes', () => {
    expect(() =>
      parseEnv({ ...valid, mediaUrlPrefix: 'ftp://x.example' }),
    ).toThrow(/Invalid environment configuration/);
  });
});
