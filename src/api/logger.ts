/**
 * Minimal redacting logger.
 *
 * `console.log` is banned by ESLint (see `eslint.config.js`); use `logWarn` /
 * `logError` only. Never log tokens, passwords or personal data — sensitive
 * keys are redacted before writing.
 */

const SENSITIVE_KEY =
  /token|password|secret|authorization|email|phone|profilepic|address/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }
  if (isRecord(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      result[key] = SENSITIVE_KEY.test(key) ? '[REDACTED]' : redact(entry);
    }
    return result;
  }
  return value;
}

export function logWarn(message: string, context?: unknown): void {
  console.warn(message, context === undefined ? undefined : redact(context));
}

export function logError(message: string, context?: unknown): void {
  console.error(message, context === undefined ? undefined : redact(context));
}
