import { api } from "./api";

export interface Coupon {
  id: number;
  title: string;
  code: string;
  coupon_type: "default" | "first_order";
  discount_type: "percentage" | "amount" | "free_delivery";
  discount: number;
  min_purchase: number;
  max_discount?: number;
  limit?: number;
  start_date: string;
  expire_date: string;
  status: number;
}

export const getCoupons = async () => {
  const response = await api.get("/coupon/list");
  return response.data as Coupon[];
};

export const applyCoupon = async (code: string, guestId?: string) => {
  const response = await api.get("/coupon/apply", {
    params: {
      code,
      guest_id: guestId,
    },
  });
  return response.data as Coupon;
};
