import { z } from 'zod';

import { requestData } from '../client';
import { bool, id } from '../helpers';

/**
 * `/currentUser` (POST, auth) — returns `{ status, message, data: User }`.
 * The User model has many more fields; this parses the known ones and passes
 * the rest through. Field names/types are INFERRED from backend-findings.md
 * (Data model — users) and are UNVERIFIED against a real payload.
 */
export const CurrentUserSchema = z
  .object({
    id,
    fname: z.string(),
    lname: z.string(),
    email: z.string().optional(),
    phone: z.string().nullable().optional(),
    profilePic: z.string().nullable().optional(),
    usertype_id: z.number().int().optional(),
    status: bool.optional(),
  })
  .passthrough();

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
