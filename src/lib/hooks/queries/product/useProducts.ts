import { fetchData } from "@/lib/api/fetchUtils";
import { queryKeys } from "@/lib/api/queries";
import { ProductResponse } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

interface GetPopularOptions {
  page?: number;
  limit?: number;
  search?: string;
}
// https://ruchicart.com/api/v1/products/popular
async function getPopularProducts(options: GetPopularOptions = {}) {
  return fetchData<ProductResponse>("/products/popular", { params: options });
}
export function usePopularProducts(options: GetPopularOptions = {}) {
  return useQuery<ProductResponse>({
    queryKey: queryKeys.products.popular,
    queryFn: () => getPopularProducts(options),
  });
}
async function getLatestProducts(options: GetPopularOptions = {}) {
  return fetchData<ProductResponse>("/products/popular", { params: options });
}
export function useLatestProducts(options: GetPopularOptions = {}) {
  return useQuery<ProductResponse>({
    queryKey: queryKeys.products.latest,
    queryFn: () => getLatestProducts(options),
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
