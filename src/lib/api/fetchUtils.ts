import axios from "axios";
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
  try {
    const { data } = await api.get(url, {
      params: options.params,
      withCredentials: true, // Ensure this is set
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Request error:", error.response?.data);
    }
    throw error;
  }
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
