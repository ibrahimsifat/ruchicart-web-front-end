import { fetchData } from "@/lib/api/fetchUtils";
import { queryKeys } from "@/lib/api/queries";
import { Category } from "@/types";
import { Cuisine } from "@/types/cuisine";
import { ProductResponse } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

interface GetCategoriesOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getCategories(options: GetCategoriesOptions = {}) {
  return fetchData<Category[]>("/categories", { params: options });
}

export function useCategories(options: GetCategoriesOptions = {}) {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => getCategories(options),
  });
}

async function getCuisines(options: GetCategoriesOptions = {}) {
  return fetchData<Cuisine[]>("/cuisine/list", { params: options });
}

export function useCuisines(options: GetCategoriesOptions = {}) {
  return useQuery<Cuisine[]>({
    queryKey: queryKeys.cuisines.all,
    queryFn: () => getCuisines(options),
  });
}

export async function getCategoryProducts(id: string | number) {
  return fetchData<ProductResponse>(`/categories/products/${id}`);
}

export function useCategory(id: string | number) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => getCategoryProducts(id),
    // Only fetch when id is present
    enabled: !!id,
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
