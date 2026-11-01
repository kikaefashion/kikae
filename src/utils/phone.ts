/**
 * Normalizes a Nigerian phone number to `+234XXXXXXXXXX`.
 * Forgiving input: leading `0` accepted, spaces/dashes/commas stripped,
 * `+234`/`234` country code accepted. Returns `null` when the input is not a
 * valid 10-digit Nigerian number.
 *
 * NOTE: the backend returns phone as `234,8000000000` and `2348000000000`;
 * both parse here. The format to SEND back is UNVERIFIED (the old app's
 * outbound format could not be confirmed from this repo).
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
