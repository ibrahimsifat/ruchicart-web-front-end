import { fetchData } from "@/lib/api/fetch-utils";
import { queryKeys } from "@/lib/api/queries";
import { BaseBranch } from "@/types/branch";
import { useQuery } from "@tanstack/react-query";

async function getBranch() {
  return fetchData<BaseBranch[]>("/branch/list");
}
export function useBranch() {
  return useQuery<BaseBranch[]>({
    queryKey: queryKeys.branches.all,
    queryFn: () => getBranch(),
  });
}
