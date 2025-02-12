import { useAuthStore } from "@/store/authStore";
import { useBranchStore } from "@/store/branchStore";
import Cookies from "js-cookie";
const API_V1 = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

type FetchOptions = RequestInit & {
  cacheConfig?: {
    revalidate?: number | false;
    tags?: string[];
  };
  params?: Record<string, any>;
};
export interface ApiError extends Error {
  status?: number;
  data?: any;
}
export async function fetcher<T>(
  endpoint: string,
  { cacheConfig, params, ...options }: FetchOptions = {}
): Promise<T> {
  try {
    // Construct URL with query parameters
    const url = new URL(`${API_V1}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Get authentication token and branch ID
    const token = useAuthStore.getState().token; // Implement this based on your auth system
    const currentBranch = useBranchStore.getState().currentBranch; // Implement this based on your store
    const locale = Cookies.get("NEXT_LOCALE") || "en"; // Implement this based on your i18n system

    const res = await fetch(url.toString(), {
      ...options,
      next: {
        revalidate: cacheConfig?.revalidate,
        tags: cacheConfig?.tags,
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
      const error = new Error("API Error") as ApiError;
      error.status = res.status;
      try {
        error.data = await res.json();
      } catch {
        error.data = await res.text();
      }
      throw error;
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      // Enhance error with request details
      const enhancedError = error as ApiError;
      enhancedError.message = `Failed to fetch ${endpoint}: ${error.message}`;
      throw enhancedError;
    }
    throw new Error(`Failed to fetch ${endpoint}`);
  }
}
