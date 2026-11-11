import type { HomeData, Product } from '@/api/endpoints/home';
import type { ProductCardProduct } from '@/components/ui/product-card';
import { mediaUrl } from '@/utils/media-url';

/** A single like entry, shared by the home and product endpoints. */
export interface ProductLike {
  user_id: string | number;
  like: boolean | number;
}

/** Liked state is derived from `likes[]`, never stored separately. */
export function isLikedBy(
  likes: readonly ProductLike[],
  userId: string | number | null,
): boolean {
  if (userId == null) return false;
  return likes.some(
    (like) =>
      Number(like.user_id) === Number(userId) &&
      (like.like === 1 || like.like === true),
  );
}

/** Maps an API product to the presentation shape the card renders. */
export function toCardProduct(product: Product): ProductCardProduct {
  return {
    id: product.id,
    name: product.name,
    storeName: product.store.name,
    price: product.price,
    oldPrice: product.old_price,
    units: product.units,
    thrift: product.thrift,
    ratings: product.ratings.map((entry) => ({ rating: entry.rating })),
    imageUrl: mediaUrl(product.media[0]?.url ?? null),
  };
}

/**
 * Optimistically adds a `{ user_id, like: 1 }` entry to the product in every
 * section where it appears (the same product may show in several sections).
 */
export function addLike(
  data: HomeData,
  productId: string | number,
  userId: string | number,
): HomeData {
  const addToProducts = (products: Product[]) =>
    products.map((product) =>
      Number(product.id) === Number(productId)
        ? {
            ...product,
            likes: [...product.likes, { user_id: userId, like: 1 }],
          }
        : product,
    );

  return {
    ...data,
    new_arrivals: addToProducts(data.new_arrivals),
    featured_products: addToProducts(data.featured_products),
    thrift_products: addToProducts(data.thrift_products),
    freebies: addToProducts(data.freebies),
  };
}
