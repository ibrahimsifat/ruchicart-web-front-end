import { getWalletTransactions } from "@/lib/api/wallet";
import { useQuery } from "@tanstack/react-query";

// useWalletTransactions
export const useWalletTransactions = (
  transactionType: string,
  page: number,
  limit: number
) => {
  return useQuery({
    queryKey: ["wallet-transactions", transactionType, page],
    queryFn: () =>
      getWalletTransactions({
        limit,
        offset: (page - 1) * limit,
        transaction_type: transactionType || undefined,
      }),
    enabled: !!transactionType,
    staleTime: 1000 * 60 * 1, // 1 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
