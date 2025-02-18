import { useAuthStore } from "@/store/authStore";
import { useBranchStore } from "@/store/branchStore";
import Cookies from "js-cookie";

const API_V1 = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

type CacheConfig = {
  /** Time in seconds for revalidation. Set false to disable, undefined for default caching */
  revalidate?: number | false;
  /** Cache tags for selective revalidation */
  tags?: string[];
  /** Force fresh data fetch */
  noCache?: boolean;
};

type GetRequestParams = {
  /** Query parameters for the request */
  params?: Record<string, string | number | boolean>;
  /** Cache configuration */
  cache?: CacheConfig;
  /** Additional headers */
  headers?: HeadersInit;
};

export interface ApiError extends Error {
  status: number;
  data: any;
}

export async function fetcher<T>(
  endpoint: string,
  options: GetRequestParams = {}
): Promise<T> {
  try {
    // Construct URL with query parameters
    const url = new URL(`${API_V1}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Get authentication token and branch ID
    const token = useAuthStore.getState().token;
    const currentBranch = useBranchStore.getState().currentBranch;
    const locale = Cookies.get("NEXT_LOCALE") || "en";

    const res = await fetch(url.toString(), {
      method: "GET",
      cache: options.cache?.noCache ? "no-store" : "default",
      next: {
        revalidate: options.cache?.revalidate,
        tags: options.cache?.tags,
      },
      headers: {
        "Content-Type": "application/json",
        "X-localization": locale,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(currentBranch?.id && { "branch-id": String(currentBranch.id) }),
        ...options.headers,
      },
    });

    if (!res.ok) {
      throw {
        status: res.status,
        data: await res.json().catch(() => res.statusText),
        message: `HTTP error! status: ${res.status}`,
      } as ApiError;
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: `Failed to fetch ${endpoint}: ${error.message}`,
        status: (error as ApiError).status || 500,
        data: (error as ApiError).data,
      } as ApiError;
    }
    throw error;
  }
}
