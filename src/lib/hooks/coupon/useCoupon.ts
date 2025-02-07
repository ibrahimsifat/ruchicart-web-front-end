import { Coupon, getCoupons } from "@/lib/api/coupon";
import { queryKeys } from "@/lib/api/queries";
import { useQuery } from "@tanstack/react-query";

export function useCoupons() {
  return useQuery<Coupon[]>({
    queryKey: queryKeys.coupons.all,
    queryFn: () => getCoupons(),
  });
}
