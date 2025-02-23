import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import { Product } from "@/types/product";
import { memo } from "react";

interface ProductImageProps {
  product: Product;
  onPreviewClick: () => void;
}

export const ProductImage = memo(
  ({ product, onPreviewClick }: ProductImageProps) => (
    <div className="relative w-[80%] h-[80%] mx-auto mt-10">
      <CustomImage
        type={ImageType.PRODUCT}
        src={product.image || "/placeholder.svg"}
        alt={product.name}
        fill
        onClick={onPreviewClick}
        className="object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={false}
        quality={75}
      />
    </div>
  )
);

ProductImage.displayName = "ProductImage";
