import { z } from 'zod';

import { request } from '../client';
import { isApiError } from '../errors';
import { classifyLoginError } from '../login-errors';

export const LoginSuccessSchema = z.object({
  token: z.string().min(1),
  success: z.string().optional(),
});

const LoginErrorSchema = z.object({
  errors: z.string(),
});

export type LoginResult =
  | { kind: 'success'; token: string }
  | { kind: 'invalid' }
  | { kind: 'unverified' }
  | { kind: 'network' }
  | { kind: 'unknown' };

/**
 * `POST {authBaseUrl}/login`. Failures arrive as HTTP 200 with `{ errors }`
 * (no machine-readable code), so this maps them to a typed result and never
 * surfaces the raw backend text. Passwords and tokens are never logged.
 */
export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  try {
    const json = await request({
      base: 'auth',
      path: '/login',
      method: 'POST',
      body: { email, password },
    });

    const success = LoginSuccessSchema.safeParse(json);
    if (success.success) {
      return { kind: 'success', token: success.data.token };
    }

    const failure = LoginErrorSchema.safeParse(json);
    if (failure.success) {
      return { kind: classifyLoginError(failure.data.errors) };
    }

    return { kind: 'unknown' };
  } catch (error) {
    if (
      isApiError(error) &&
      (error.kind === 'network' || error.kind === 'timeout')
    ) {
      return { kind: 'network' };
    }
    return { kind: 'unknown' };
  }
}
