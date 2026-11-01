import { z } from 'zod';

const httpUrl = z
  .string()
  .url()
  .refine(
    (value) => value.startsWith('http://') || value.startsWith('https://'),
    {
      message: 'must be an http(s) URL',
    },
  );

const EnvSchema = z.object({
  authBaseUrl: httpUrl,
  apiBaseUrl: httpUrl,
  mediaUrlPrefix: httpUrl,
});

export type Env = z.infer<typeof EnvSchema>;

export interface EnvInput {
  authBaseUrl: string | undefined;
  apiBaseUrl: string | undefined;
  mediaUrlPrefix: string | undefined;
}

/** Validates `EXPO_PUBLIC_*` values and throws a clear, actionable error on failure. */
export function parseEnv(input: EnvInput): Env {
  const result = EnvSchema.safeParse(input);
  if (result.success) {
    return result.data;
  }

  const missing = Object.entries(input)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  const details = result.error.issues
    .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('; ');

  throw new Error(
    `Invalid environment configuration. Missing: ${missing.join(', ') || 'none'}. ` +
      `Details: ${details}. Set the EXPO_PUBLIC_* variables in .env.*.`,
  );
}

export const env: Env = parseEnv({
  authBaseUrl: process.env.EXPO_PUBLIC_AUTH_URL,
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL,
  mediaUrlPrefix: process.env.EXPO_PUBLIC_MEDIA_URL_PREFIX,
});
