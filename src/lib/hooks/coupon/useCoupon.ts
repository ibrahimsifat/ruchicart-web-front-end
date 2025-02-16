import { api } from "@/lib/api/api";
import { getQueryClient, queryKeys } from "@/lib/api/queries";
import { Coupon, CouponError } from "@/types/coupon";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export function useCoupons() {
  return useQuery<Coupon[]>({
    queryKey: queryKeys.coupons.all,
    queryFn: () => getCoupons(),
  });
}

export function useApplyCoupon({ guestId }: { guestId?: string }) {
  const queryClient = getQueryClient();
  return useMutation<Coupon, CouponError, string>({
    mutationFn: (code) => applyCoupon(code, guestId),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.coupons.all, (old: Coupon[]) => [
        ...old,
        data,
      ]);
    },
  });
}
