/**
 * Normalizes a Nigerian phone number to `+234XXXXXXXXXX`.
 * Forgiving input: leading `0` accepted, spaces/dashes stripped, `+234`/`234`
 * country code accepted. Returns `null` when the input is not a valid
 * 10-digit Nigerian number.
 */
export function normalizeNigerianPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');

  let local = digits;
  if (local.startsWith('234') && local.length === 13) {
    local = local.slice(3);
  } else if (local.startsWith('0')) {
    local = local.slice(1);
  }

  if (local.length !== 10) {
    return null;
  }

  return `+234${local}`;
}
