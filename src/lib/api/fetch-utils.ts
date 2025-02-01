// lib/api/fetch-utils.ts
import { api } from "./api";
import { getQueryClient } from "./queries";

interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
  params?: Record<string, any>;
}

export async function fetchData<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { data } = await api.get(url, {
    params: options.params,
  });
  return data;
}

export async function prefetchQuery(
  queryKey: readonly unknown[],
  queryFn: () => Promise<any>
) {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 30000, // 30 seconds
    });
  } catch (error) {
    console.error("Prefetch error:", error);
  }

  return queryClient;
}
