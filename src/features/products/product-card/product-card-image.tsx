"use client";
import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import { Product } from "@/types/product";
import { useState } from "react";
import { ProductPreviewModal } from "../product-preview-modal";

const ProductCardImage = ({ product }: { product: Product }) => {
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div>
      <CustomImage
        type={ImageType.PRODUCT}
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        fill
        onClick={() => setShowPreview(true)}
        className="object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
      />
      <ProductPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        product={product}
      />
    </div>
  );
};

export default ProductCardImage;
