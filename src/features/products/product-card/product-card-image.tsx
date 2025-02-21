"use client";
import CustomImage from "@/components/ui/customImage";
import { useRouter } from "@/i18n/routing";
import {
  useAddToWishlist,
  useDeleteFromWishlist,
  useGetWishlist,
} from "@/lib/hooks/queries/wishlist/usewishlist";
import { cn } from "@/lib/utils/utils";
import { useAuthStore } from "@/store/authStore";
import { ImageType } from "@/types/image";
import { Product } from "@/types/product";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductPreviewModal } from "../product-preview-modal";

const ProductCardImage = ({ product }: { product: Product }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isWishListed, setIsWishListed] = useState(false);
  const { user } = useAuthStore();
  const { mutate: addToWishlist } = useAddToWishlist(product.id);
  const { mutate: deleteFromWishlist } = useDeleteFromWishlist(product.id);

  // Only fetch wishlist data if user is authenticated
  const { data: wishlist } = useGetWishlist({
    pageParam: 1,
    enabled: !!user, // This will prevent the query from running if user is not authenticated
  });
  const router = useRouter();

  useEffect(() => {
    if (wishlist?.products.some((item) => item.id === product.id)) {
      setIsWishListed(true);
    }
  }, [wishlist]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    e.stopPropagation();
    setIsWishListed(!isWishListed);
    if (isWishListed) {
      deleteFromWishlist();
    } else {
      addToWishlist();
    }
  };

  return (
    <div className="relative group aspect-square w-full max-h-[320px]">
      <button
        onClick={handleWishlistClick}
        className={cn(
          "absolute -top-6 right-0 z-10 rounded-full p-1.5 bg-white/80 backdrop-blur-sm",
          "transition-all duration-300 hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1",
          isWishListed
            ? "text-red-500 hover:text-red-600"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        <Heart
          className={cn("h-5 w-5", isWishListed ? "fill-current" : "fill-none")}
        />
      </button>

      <div className="relative w-[80%] h-[80%] mx-auto mt-10">
        <CustomImage
          type={ImageType.PRODUCT}
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          onClick={() => setShowPreview(true)}
          className="object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
        />
      </div>

      <ProductPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        product={product}
      />
    </div>
  );
};

export default ProductCardImage;
