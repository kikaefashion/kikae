import { classifyLoginError } from '../login-errors';

describe('classifyLoginError', () => {
  it('derives unverified from the response text', () => {
    expect(
      classifyLoginError(
        'Please verify your email address before logging in.',
      ),
    ).toBe('unverified');
  });

  it('derives invalid from the credentials text', () => {
    expect(
      classifyLoginError(
        'The credentials you provided could not be verified.',
      ),
    ).toBe('invalid');
  });

  it('falls back to unknown for unrecognised text', () => {
    expect(classifyLoginError('Something else went wrong.')).toBe('unknown');
  });

  it('is case-insensitive', () => {
    expect(classifyLoginError('PLEASE VERIFY YOUR EMAIL ADDRESS')).toBe(
      'unverified',
    );
  });
});
