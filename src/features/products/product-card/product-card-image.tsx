"use client";
import { useWishlist } from "@/lib/hooks/product/useWishlist";
import { Product } from "@/types/product";
import { memo, useState } from "react";
import { ProductPreviewModal } from "../product-preview/product-preview-modal";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

export const ProductCardImage = memo(({ product }: { product: Product }) => {
  const [showPreview, setShowPreview] = useState(false);
  const { isWishListed, toggleWishlist } = useWishlist(product.id);

  return (
    <div className="relative group aspect-square w-full max-h-[320px]">
      <WishlistButton isWishListed={isWishListed} onClick={toggleWishlist} />
      <ProductImage
        product={product}
        onPreviewClick={() => setShowPreview(true)}
      />
      <ProductPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        product={product}
      />
    </div>
  );
});

ProductCardImage.displayName = "ProductCardImage";
