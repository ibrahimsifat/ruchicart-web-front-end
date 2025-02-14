import { Product, ProductResponse } from "@/types/product";
import { fetcher } from "./api.service";

export async function getFeaturedProducts(): Promise<ProductResponse> {
  return fetcher<ProductResponse>("/products/latest", {
    cacheConfig: {
      revalidate: 3600, // Revalidate every hour
      tags: ["featured-products"],
    },
  });
}
export async function getTrendingProducts() {
  return fetcher<ProductResponse[]>("/products/popular", {
    cacheConfig: {
      revalidate: 3600, // Revalidate every hour
      tags: ["trending-products"],
    },
  });
}
export async function getProductDetails(id: string) {
  return fetcher<Product>(`/products/details/${id}`);
}

export interface GetRelatedProductsParams {
  currentProductId: number;
  limit?: number;
}

export async function getRelatedProducts({
  currentProductId,
  limit = 10,
}: GetRelatedProductsParams): Promise<Product[]> {
  return fetcher<Product[]>(`/products/related-products/${currentProductId}`, {
    params: {
      limit,
    },
    cacheConfig: {
      revalidate: 3600, // Revalidate every hour
      tags: [`related-products:${currentProductId}`],
    },
  });
}
