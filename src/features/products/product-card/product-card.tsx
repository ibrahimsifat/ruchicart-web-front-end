import { Card } from "@/components/ui/card";
import { ProductCardProps } from "@/types/product";
import { Suspense } from "react";
import { ProductCardImage } from "./product-card-image";
import { ProductBadges } from "./ProductBadges";
import { ProductCardContent } from "./ProductCardContent";

const ProductCardSkeleton = () => (
  <Card className="group overflow-hidden animate-pulse">
    <div className="relative aspect-square w-[90%] h-[90%] mx-auto bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-6 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </Card>
);

export function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  return (
    <Suspense fallback={<ProductCardSkeleton />}>
      <Card className="group overflow-hidden">
        <div className="relative aspect-square overflow-hidden w-[90%] h-[90%] mx-auto">
          <ProductCardImage product={product} />
          <ProductBadges product={product} />
        </div>
        <ProductCardContent product={product} showAddToCart={showAddToCart} />
      </Card>
    </Suspense>
  );
}

ProductCard.displayName = "ProductCard";
