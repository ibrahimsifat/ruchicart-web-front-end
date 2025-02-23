import { DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductDetailsAddToCart } from "@/features/product-details/product-details-add-to-cart";
import { ProductGallery } from "@/features/product-details/product-gallery";
import { Product } from "@/types/product";
import { Star } from "lucide-react";
import { memo, Suspense } from "react";
import { ProductCardAction } from "../product-card/product-card-action";

export const ProductGallerySection = memo(
  ({ product }: { product: Product }) => (
    <Suspense fallback={<Skeleton className="aspect-square rounded-xl" />}>
      <ProductGallery product={product} />
    </Suspense>
  )
);

ProductGallerySection.displayName = "ProductGallerySection";

export const ProductDetailsSection = memo(
  ({ product }: { product: Product }) => (
    <div>
      <ProductHeader product={product} />
      <ProductAddToCartSection product={product} />
      <ProductActionSection product={product} />
    </div>
  )
);

ProductDetailsSection.displayName = "ProductDetailsSection";

export const ProductHeader = memo(({ product }: { product: Product }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <DialogTitle className="text-3xl font-bold">{product.name}</DialogTitle>
      <ProductRating rating={product.rating} />
    </div>
    <p className="text-muted-foreground">
      {product.description.slice(0, 100)}...
    </p>
  </div>
));

ProductHeader.displayName = "ProductHeader";

export const ProductRating = memo(({ rating }: { rating: number[] }) => (
  <div className="flex items-center gap-1">
    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
    <span className="font-medium">
      {rating.length > 0
        ? (rating.reduce((acc, curr) => acc + curr, 0) / rating.length).toFixed(
            1
          )
        : "N/A"}
    </span>
  </div>
));

ProductRating.displayName = "ProductRating";

export const ProductAddToCartSection = memo(
  ({ product }: { product: Product }) => (
    <Suspense fallback={<Skeleton className="h-[400px]" />}>
      <ProductDetailsAddToCart product={product} />
    </Suspense>
  )
);

ProductAddToCartSection.displayName = "ProductAddToCartSection";

export const ProductActionSection = memo(
  ({ product }: { product: Product }) => (
    <div className="mt-3">
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <ProductCardAction product={product} showAddToCart={false} />
      </Suspense>
    </div>
  )
);

ProductActionSection.displayName = "ProductActionSection";
