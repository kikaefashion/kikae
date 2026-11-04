import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

/**
 * Typed JSON fixtures for the e2e backend mocks. The shapes mirror the app's
 * sanitized MSW handlers (which in turn were derived from the real backend
 * responses), but they are declared here standalone so the test process never
 * imports `src/config/env` (whose EXPO_PUBLIC_* values are inlined at build
 * time, not present at test runtime).
 */

const FIXTURES_DIR = join(process.cwd(), 'e2e', 'fixtures');

const LoginSuccessSchema = z.object({
  token: z.string().min(1),
  success: z.string().optional(),
});

const LoginErrorSchema = z.object({
  errors: z.string().min(1),
});

const UsertypeSchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  name: z.string().optional(),
  store_id: z.union([z.number().int(), z.string()]).nullable().optional(),
});

const AddressSchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  address: z.string(),
  state_id: z.union([z.number().int(), z.string()]).nullable().optional(),
  city: z.string().nullable().optional(),
  isDefault: z.boolean().optional(),
});

const CurrentUserSchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  fname: z.string(),
  lname: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  profilePic: z.string().nullable().optional(),
  dob: z.string().optional(),
  usertype_id: z.number().int(),
  status: z.boolean().optional(),
  usertype: UsertypeSchema.nullable().optional(),
  addresses: z.array(AddressSchema).optional(),
  followings: z.array(z.object({}).passthrough()).optional(),
  user_badge: z.array(z.string()).optional(),
});

const CurrentUserEnvelopeSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: CurrentUserSchema,
});

const ProductTypeSchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  name: z.string(),
});

const ProductSubcategorySchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  name: z.string(),
  productTypes: z.array(ProductTypeSchema).optional(),
});

const ProductCategorySchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  name: z.string(),
  description: z.string().nullable().optional(),
  subcategories: z.array(ProductSubcategorySchema).optional(),
});

const CategoriesEnvelopeSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.array(ProductCategorySchema),
});

function load<T>(filename: string, schema: z.ZodType<T>): T {
  const raw = readFileSync(join(FIXTURES_DIR, filename), 'utf8');
  return schema.parse(JSON.parse(raw));
}

export const loginSuccess = load('login-success.json', LoginSuccessSchema);
export const loginInvalid = load('login-invalid.json', LoginErrorSchema);
export const loginUnverified = load('login-unverified.json', LoginErrorSchema);
export const currentUser = load('current-user.json', CurrentUserEnvelopeSchema);
export const categories = load('categories.json', CategoriesEnvelopeSchema);

export type CurrentUser = z.infer<typeof CurrentUserSchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
