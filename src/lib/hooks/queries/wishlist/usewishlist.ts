import { getQueryClient, queryKeys } from "@/lib/api/queries";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "@/lib/api/wishlist";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetWishlist = ({ pageParam = 1 }: { pageParam?: number }) => {
  return useQuery({
    queryKey: queryKeys.wishlist.all,
    queryFn: () => getWishlist({ pageParam }),
  });
};

export const useAddToWishlist = (productId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: () => addToWishlist(productId),
    onSuccess: () => {
      // invalidate wishlist query
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlist.all,
      });
    },
  });
};

export const useDeleteFromWishlist = (productId: number) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: () => removeFromWishlist(productId),
    onSuccess: () => {
      // invalidate wishlist query
      queryClient.invalidateQueries({
        queryKey: queryKeys.wishlist.all,
      });
    },
  });
};
