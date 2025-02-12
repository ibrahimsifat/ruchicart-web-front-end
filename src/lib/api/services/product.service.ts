import { Product, ProductResponse } from "@/types/product";
import { fetchData } from "../fetchUtils";
import { fetcher } from "./api.service";

export async function getFeaturedProducts() {
  return fetcher<ProductResponse[]>("/products/popular", {
    cacheConfig: {
      revalidate: 3600, // Revalidate every hour
      tags: ["featured-products"],
    },
  });
}

export async function getTrendingProducts() {
  return fetcher<ProductResponse[]>("/products/latest", {
    cacheConfig: {
      revalidate: 3600, // Revalidate every hour
      tags: ["trending-products"],
    },
  });
}
export async function getProductDetails(id: string) {
  return fetcher<Product>(`/products/${id}`, {
    cacheConfig: {
      revalidate: 600, // 10 minutes
      tags: [`product:${id}`],
    },
  });
}

export interface GetRelatedProductsParams {
  currentProductId: number;
  limit?: number;
}

export async function getRelatedProducts({
  currentProductId,
  limit = 10,
}: GetRelatedProductsParams): Promise<Product[]> {
  return fetchData<Product[]>(
    `/products/related-products/${currentProductId}`,
    {
      params: {
        limit,
      },
    }
  );
}

//   if (!categoryIds.length || !currentProductId) {
//     return [];
//   }

//   return fetcher<Product[]>(`/products/related-products/${currentProductId}`, {
//     cacheConfig: {
//       revalidate: CONSTANT.API_CACHE_TIMES.MEDIUM,
//       tags: ["related-products", `product-${currentProductId}`],
//     },
//     params: {
//       category_ids: categoryIds.join(","),
//       exclude_id: currentProductId,
//       limit,
//     },
//   });
// }
