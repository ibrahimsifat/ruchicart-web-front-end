import { Product, ProductResponse } from "@/types/product";
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
