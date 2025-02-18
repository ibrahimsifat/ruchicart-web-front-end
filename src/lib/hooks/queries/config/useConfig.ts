import { config } from "@/config";
import { fetchConfig } from "@/lib/api/config";
import { getQueryClient } from "@/lib/api/queries";
import { ConfigType } from "@/types/config";
import { useQuery } from "@tanstack/react-query";

type ConfigResponse = {
  data: ConfigType;
  isLoading: boolean;
  error: Error | null;
  refetchConfig: () => void;
};

export const useConfig = (): ConfigResponse => {
  const queryClient = getQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["config"],
    queryFn: fetchConfig,
    staleTime: config.configCacheTime,
    gcTime: config.configCacheTime,
    retry: 2,
  });

  const refetchConfig = () => {
    queryClient.invalidateQueries({ queryKey: ["config"] });
  };

  return { data, isLoading, error, refetchConfig };
};
