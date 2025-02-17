import { config } from "@/config";
import { fetchConfig } from "@/lib/api/config";
import { getQueryClient } from "@/lib/api/queries";
import { useQuery } from "@tanstack/react-query";

export const useConfig = () => {
  const queryClient = getQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["config"],
    queryFn: fetchConfig,
    staleTime: config.configCacheTime,
    gcTime: config.configCacheTime,
  });

  const refetchConfig = () => {
    queryClient.invalidateQueries({ queryKey: ["config"] });
  };

  return { config: data, isLoading, error, refetchConfig };
};
