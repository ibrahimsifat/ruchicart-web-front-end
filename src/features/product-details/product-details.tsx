import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import { Product } from "@/types/product";

export function ProductDetailsImage({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <CustomImage
            type={ImageType.PRODUCT}
            src={product.image}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
