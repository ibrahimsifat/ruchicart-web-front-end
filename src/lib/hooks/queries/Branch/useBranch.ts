import { api } from "@/lib/api/api";
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

export async function getBranchById(branchId: number) {
  return fetchData<BaseBranch>(`/branch/${branchId}`);
}
export function useBranchById(branchId: number) {
  return useQuery<BaseBranch>({
    queryKey: queryKeys.branches.byId(branchId),
    queryFn: () => getBranchById(branchId),
  });
}

/**
 *  const res = await api.post("/products/change-branch", {
          from_branch_id: currentBranch?.id,
          to_branch_id: branch.id,
          products: [
            {
              product_id: 2,
              quantity: 3,
              variations: [],
            },
          ],
          product_ids: [2],
        });
 */

export const changeBranch = async (params: {
  from_branch_id: number;
  to_branch_id: number;
  product_ids: number[];
  products: {
    product_id: number;
    quantity: number;
    variations: {
      variation_id: number;
      value: string;
    }[];
  }[];
}) => {
  const res = await api.post("/products/change-branch", params);
  return res.data;
};

/**
 * Get products from a specific branch
 * @param branchId - The ID of the branch to get products from
 * @param options - Additional options for the query
 * @returns A promise that resolves to the products from the specified branch
 */

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
