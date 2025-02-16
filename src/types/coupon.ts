export interface Coupon {
  id: number;
  title: string;
  code: string;
  start_date: string;
  expire_date: string;
  min_purchase: number;
  max_discount: number;
  discount: number;
  discount_type: "percent" | "amount";
  status: number;
  created_at: string;
  updated_at: string;
  coupon_type: "default" | "first_order";
  limit: number | null;
}

export interface CouponError {
  code: string;
  message: string;
}
