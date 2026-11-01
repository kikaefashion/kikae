import { z } from 'zod';

import { requestData } from '../client';
import { bool, dateOnly, id } from '../helpers';

/**
 * `/currentUser` (POST, auth) — returns `{ status, message, data: User }`.
 *
 * Declares only the fields the app uses; Zod strips unknown keys, so sensitive
 * fields the backend still serializes (`code`, `email_verification_code`,
 * `provider`, `provider_id`, `referrer_id`, `referrer_type`, `isVendor`,
 * `isAdmin`) never enter state or logs. Vendor role is derived from
 * `usertype_id` (or `usertype`), and the vendor's store id comes from
 * `usertype.store_id` — not from the null `isVendor`/`isAdmin` flags.
 */

const UsertypeSchema = z
  .object({
    id,
    name: z.string().optional(),
    store_id: id.nullable().optional(),
  })
  .passthrough();

const AddressSchema = z
  .object({
    id,
    address: z.string(),
    state_id: id.nullable().optional(),
    city: z.string().nullable().optional(),
    isDefault: bool.optional(),
  })
  .passthrough();

const FollowSchema = z
  .object({
    id: id.optional(),
    store_id: id.optional(),
    user_id: id.optional(),
  })
  .passthrough();

export const CurrentUserSchema = z.object({
  id,
  fname: z.string(),
  lname: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  profilePic: z.string().nullable().optional(),
  dob: dateOnly.optional(),
  usertype_id: z.number().int(),
  status: bool.optional(),
  usertype: UsertypeSchema.nullable().optional(),
  addresses: z.array(AddressSchema).optional().default([]),
  followings: z.array(FollowSchema).optional().default([]),
  user_badge: z.array(z.string()).optional().default([]),
});

export type CurrentUser = z.infer<typeof CurrentUserSchema>;

export function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUser> {
  return requestData({
    base: 'api',
    path: '/currentUser',
    method: 'POST',
    auth: true,
    signal,
    dataSchema: CurrentUserSchema,
  });
}
