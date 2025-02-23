import { useRouter } from "@/i18n/routing";
import {
  useAddToWishlist,
  useDeleteFromWishlist,
  useGetWishlist,
} from "@/lib/hooks/queries/wishlist/usewishlist";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export const useWishlist = (productId: number) => {
  const [isWishListed, setIsWishListed] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate: addToWishlist } = useAddToWishlist(productId);
  const { mutate: deleteFromWishlist } = useDeleteFromWishlist(productId);
  const { data: wishlist } = useGetWishlist({
    pageParam: 1,
    enabled: !!user,
  });

  useEffect(() => {
    if (wishlist?.products.some((item) => item.id === productId)) {
      setIsWishListed(true);
    }
  }, [wishlist, productId]);

  const toggleWishlist = (e: React.MouseEvent) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    e.stopPropagation();
    setIsWishListed(!isWishListed);
    isWishListed ? deleteFromWishlist() : addToWishlist();
  };

  return { isWishListed, toggleWishlist };
};
