import { queryKeys } from "@/lib/api/queries";
import { fetcher } from "@/lib/api/services/api.service";
import { BannerItem } from "@/types/banner";
import { useQuery } from "@tanstack/react-query";

export async function getBanners() {
  return fetcher<BannerItem[]>("/banners");
}
export function useBanners() {
  return useQuery<BannerItem[]>({
    queryKey: queryKeys.banners.all,
    queryFn: () => getBanners(),
  });
}
