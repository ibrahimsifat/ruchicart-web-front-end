import type { ProductResponse } from "@/types/product";
import { api } from "./api";
import { fetcher } from "./services/api.service";

interface RecommendedData {
  categories: Array<{
    id: number;
    name: string;
    image: string;
    banner_image: string;
  }>;
  cuisines: string[];
}
export async function searchProducts(params: {
  name?: string;
  rating?: number;
  category_id?: string | string[] | number | number[];
  cuisine_id?: string | string[];
  product_type?: string;
  sort_by?: string;
  limit?: number;
  offset?: number;
  min_price?: number;
  max_price?: number;
}): Promise<ProductResponse> {
  // Format the parameters before sending
  const formattedParams = {
    ...params,
    category_id: formatCategoryId(params.category_id),
  };

  const response = await api.post("/products/search", formattedParams);
  return response.data;
}

// Helper function to format category_id
function formatCategoryId(
  categoryId?: string | string[] | number | number[]
): string | undefined {
  if (!categoryId) return undefined;

  // If it's already a string and starts with '[', assume it's already formatted
  if (typeof categoryId === "string" && categoryId.startsWith("[")) {
    return categoryId;
  }

  // Convert single number or string to array format
  if (typeof categoryId === "number" || typeof categoryId === "string") {
    return `[${categoryId}]`;
  }

  // If it's already an array, format it
  if (Array.isArray(categoryId)) {
    return `[${categoryId.join(",")}]`;
  }

  return undefined;
}

export async function getRecommendedData() {
  const { data } = await api.get("/products/search-recommended");
  return data;
}

export const fetchRecommendedData = async (): Promise<RecommendedData> => {
  const data = await fetcher("/products/search-recommended");
  return data as RecommendedData;
};
