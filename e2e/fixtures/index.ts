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

const MediaSchema = z.object({
  url: z.string().nullable(),
});

const StoreSchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  name: z.string(),
  logo: z.string().nullable(),
});

const LikeSchema = z.object({
  user_id: z.union([z.number().int(), z.string()]),
  like: z.union([z.boolean(), z.number()]),
});

const HomeProductSchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  name: z.string(),
  price: z.number(),
  old_price: z.number().nullable(),
  status: z.string(),
  units: z.number().int(),
  thrift: z.boolean().nullable(),
  made_in_nigeria: z.boolean().optional(),
  rating: z.number().nullable(),
  store: StoreSchema,
  media: z.array(MediaSchema),
  likes: z.array(LikeSchema),
});

const HomeCategorySchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  name: z.string(),
  product_count: z.number().int(),
  total_views: z.number().int(),
  image: z.string().nullable(),
});

const HomeDataSchema = z.object({
  new_arrivals: z.array(HomeProductSchema),
  featured_products: z.array(HomeProductSchema),
  thrift_products: z.array(HomeProductSchema),
  freebies: z.array(HomeProductSchema),
  trending_categories: z.array(HomeCategorySchema),
});

const HomeEnvelopeSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: HomeDataSchema,
});

const BannerSchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  title: z.string(),
  text: z.string(),
  file: z.string(),
  position: z.number().int(),
  url: z.string(),
});

const BannerEnvelopeSchema = z.object({
  status: z.boolean(),
  data: z.array(BannerSchema),
});

const ProductDetailSchema = z.object({
  id: z.union([z.number().int(), z.string()]),
  old_price: z.number().nullable(),
  price: z.number(),
  name: z.string(),
  status: z.string(),
  description: z.string().nullable().optional(),
  units: z.number().int(),
  thrift: z.boolean().nullable(),
  media: z.array(z.object({ url: z.string().nullable() })),
  sizes: z.array(z.object({ size: z.string() })),
  colours: z.array(z.object({ name: z.string() })),
  ratings: z.array(z.object({ rating: z.number() })),
  store: z.object({
    id: z.union([z.number().int(), z.string()]),
    name: z.string(),
    logo: z.string().nullable(),
  }),
  likes: z.array(
    z.object({
      user_id: z.union([z.number().int(), z.string()]),
      like: z.union([z.boolean(), z.number()]),
    }),
  ),
  isMakeup: z.union([z.boolean(), z.number(), z.null()]).optional(),
  coverages: z.array(
    z.object({ area: z.string(), fee: z.union([z.number(), z.string()]) }),
  ),
  availability: z.array(
    z.object({
      dated: z.string(),
      available: z.union([z.boolean(), z.number()]),
    }),
  ),
});

const ProductEnvelopeSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: ProductDetailSchema,
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
export const home = load('home.json', HomeEnvelopeSchema);
export const banners = load('banners.json', BannerEnvelopeSchema);
export const product = load('product.json', ProductEnvelopeSchema);

export type CurrentUser = z.infer<typeof CurrentUserSchema>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ProductDetail = z.infer<typeof ProductDetailSchema>;
