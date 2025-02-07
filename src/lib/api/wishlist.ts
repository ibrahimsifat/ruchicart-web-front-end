import type { Product } from "@/types/product";
import { api } from "./api";

export interface WishlistResponse {
  total_size: number;
  limit: number;
  offset: number;
  products: Product[];
}

export const getWishlist = async ({ pageParam = 1 }) => {
  const limit = 8;
  const response = await api.get<WishlistResponse>("/customer/wish-list", {
    params: {
      limit,
      offset: pageParam,
    },
  });
  return {
    ...response.data,
    nextPage:
      response.data.total_size > pageParam * limit ? pageParam + 1 : undefined,
  };
};

export const addToWishlist = async (productId: number) => {
  const response = await api.post("/customer/wish-list/add", {
    product_id: productId,
  });
  return response.data;
};

export const removeFromWishlist = async (productId?: number) => {
  const response = await api.delete("/customer/wish-list/remove", {
    data: {
      type: productId ? "single" : "all",
      product_id: productId,
    },
  });
  return response.data;
};
