import { useAuthStore } from "@/store/authStore";
import { useBranchStore } from "@/store/branchStore";
import Cookies from "js-cookie";
const API_V1 = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

const locale = Cookies.get("NEXT_LOCALE") || "en";
const token = useAuthStore.getState().token;
const currentBranch = useBranchStore.getState().currentBranch;

type FetchOptions = RequestInit & {
  cacheConfig?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export async function fetcher<T>(
  endpoint: string,
  { cacheConfig, ...options }: FetchOptions = {}
): Promise<T> {
  const res = await fetch(`${API_V1}${endpoint}`, {
    ...options,
    next: {
      revalidate: cacheConfig?.revalidate,
      tags: cacheConfig?.tags,
    },
    headers: {
      "Content-Type": "application/json",
      "X-localization": `${locale}`,
      Authorization: `Bearer ${token}`,
      "branch-id": `${currentBranch?.id}`,
      ...options.headers,
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
}
