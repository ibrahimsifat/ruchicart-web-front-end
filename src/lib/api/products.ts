import type { ProductResponse } from "@/types/product";
import { api } from "./api";

export async function searchProducts(params: {
  name?: string;
  rating?: number;
  category_id?: string | string[];
  cuisine_id?: string | string[];
  product_type?: string;
  sort_by?: string;
  limit?: number;
  offset?: number;
  min_price?: number;
  max_price?: number;
}): Promise<ProductResponse> {
  const response = await api.post("/products/search", params);
  return response.data;
}

export async function getRecommendedData() {
  const { data } = await api.get("/products/search-recommended");
  return data;
}
