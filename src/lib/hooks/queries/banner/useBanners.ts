import { fetchData } from "@/lib/api/fetch-utils";
import { queryKeys } from "@/lib/api/queries";
import { BannerItem } from "@/types/banner";
import { useQuery } from "@tanstack/react-query";

interface GetBannersOptions {
  page?: number;
  limit?: number;
  search?: string;
}

async function getBanners(options: GetBannersOptions = {}) {
  return fetchData<BannerItem[]>("/banners", { params: options });
}
export function useBanners(options: GetBannersOptions = {}) {
  return useQuery<BannerItem[]>({
    queryKey: queryKeys.banners.all,
    queryFn: () => getBanners(options),
  });
}
