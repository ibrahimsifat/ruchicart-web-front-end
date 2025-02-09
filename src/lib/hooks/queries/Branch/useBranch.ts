import { fetchData } from "@/lib/api/fetchUtils";
import { queryKeys } from "@/lib/api/queries";
import { useBranchStore } from "@/store/branchStore";
import { BaseBranch } from "@/types/branch";
import { ProductResponse } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
interface GetPopularOptions {
  page?: number;
  limit?: number;
  search?: string;
}
export async function getBranch() {
  return fetchData<BaseBranch[]>("/branch/list");
}
export function useBranch() {
  return useQuery<BaseBranch[]>({
    queryKey: queryKeys.branches.all,
    queryFn: () => getBranch(),
  });
}

async function getBranchProducts(
  branchId: number | undefined,
  options: GetPopularOptions = {}
) {
  if (!branchId) {
    throw new Error("Branch ID is required");
  }
  return fetchData<ProductResponse>(`branch/products`, {
    params: {
      branch_id: branchId,
      ...options,
    },
  });
}

export function useBranchProducts(options: GetPopularOptions = {}) {
  const { currentBranch } = useBranchStore();

  return useQuery<ProductResponse>({
    queryKey: ["products", "branch", currentBranch?.id, options],
    queryFn: () => getBranchProducts(currentBranch?.id, options),
    // Don't run the query if there's no branch selected
    enabled: !!currentBranch?.id,
  });
}
