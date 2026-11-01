import { logError, logWarn } from '../logger';

describe('logger', () => {
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('redacts sensitive keys', () => {
    logWarn('msg', { token: 'secret', email: 'a@b.c', name: 'Ada' });

    expect(warnSpy).toHaveBeenCalledWith('msg', {
      token: '[REDACTED]',
      email: '[REDACTED]',
      name: 'Ada',
    });
  });

  it('redacts nested and array values', () => {
    logError('err', {
      user: { password: 'x', phone: '123' },
      items: [{ token: 'y' }],
    });

    expect(errorSpy).toHaveBeenCalledWith('err', {
      user: { password: '[REDACTED]', phone: '[REDACTED]' },
      items: [{ token: '[REDACTED]' }],
    });
  });

  it('passes primitives through unchanged', () => {
    logWarn('m', 'plain');
    expect(warnSpy).toHaveBeenCalledWith('m', 'plain');
  });
});
