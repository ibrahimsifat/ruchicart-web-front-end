import { fetchData } from "@/lib/api/fetchUtils";
import { queryKeys } from "@/lib/api/queries";
import { fetcher } from "@/lib/api/services/api.service";
import {
  getFeaturedProducts,
  getRelatedProducts,
} from "@/lib/api/services/product.service";
import { Review } from "@/types/order";
import { Product, ProductResponse } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

interface GetPopularOptions {
  page?: number;
  limit?: number;
  search?: string;
}
// https://ruchicart.com/api/v1/products/popular
export async function getPopularProducts(options: GetPopularOptions = {}) {
  return fetchData<ProductResponse>("/products/popular", { params: options });
}

export function usePopularProducts(options: GetPopularOptions = {}) {
  return useQuery<ProductResponse>({
    queryKey: queryKeys.products.popular,
    queryFn: () => getPopularProducts(options),
  });
}
export async function getProductDetails(id: string) {
  return fetchData<Product>(`/products/details/${id}`);
}

export function useProductDetails(id: string) {
  return useQuery<Product>({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductDetails(id),
  });
}

export function useLatestProducts() {
  return useQuery<ProductResponse>({
    queryKey: queryKeys.products.latest,
    queryFn: () => getFeaturedProducts(),
  });
}
async function getBranchProducts(options: GetPopularOptions = {}) {
  return fetchData<ProductResponse>(`branch/products?branch_id=${1}`, {
    params: options,
  });
}

export function useBranchProducts(options: GetPopularOptions = {}) {
  return useQuery<ProductResponse>({
    queryKey: queryKeys.products.branch,
    queryFn: () => getBranchProducts(options),
  });
}

export function useRelatedProducts(productId: number) {
  return useQuery<Product[]>({
    queryKey: queryKeys.products.related(productId),
    queryFn: () => getRelatedProducts({ currentProductId: productId }),
  });
}

export function getReviews(productId: number) {
  return fetcher<Review[]>(`/products/reviews/${productId}`);
}

export function useReviews(productId: number) {
  return useQuery<Review[]>({
    queryKey: queryKeys.reviews.byId(productId),
    queryFn: () => getReviews(productId),
  });
}

export function getRating(productId: number) {
  return fetcher(`/products/rating/${productId}`);
}

export function useRating(productId: number) {
  return useQuery({
    queryKey: queryKeys.rating.byId(productId),
    queryFn: () => getRating(productId),
  });
}

// export function useInfiniteCategories(
//   options: Omit<GetCategoriesOptions, "page"> = {}
// ) {
//   return useInfiniteQuery({
//     queryKey: queryKeys.categories.infinite(options),
//     queryFn: ({ pageParam = 1 }) =>
//       getCategories({ ...options, page: pageParam }),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) =>
//       lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
//   });
// }
