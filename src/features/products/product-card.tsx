import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import type { Product } from "@/types/product";
import Link from "next/link";

import { Suspense } from "react";
import ProductCardAction from "./product-card/product-card-action";
import ProductCardRating from "./product-card/product-card-rating";
import ProductCardTimestamp from "./product-card/product-card-timestamp";
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice =
    product.discount_type === "percent"
      ? product.price - (product.price * product.discount) / 100
      : product.price - product.discount;

  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden w-[90%] h-[90%] mx-auto">
          <CustomImage
            type={ImageType.PRODUCT}
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110 "
          />
          {product.is_recommended === 1 && (
            <Badge className="bg-primary absolute left-2 top-9">
              Recommended
            </Badge>
          )}

          {product.discount > 0 && (
            <Badge variant="destructive" className="absolute right-2 top-2">
              {product.discount_type === "percent"
                ? `${product.discount}% OFF`
                : `$${product.discount} OFF`}
            </Badge>
          )}
          {product.product_type === "veg" && (
            <Badge variant="secondary" className="absolute left-2 top-2">
              Veg
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <ProductCardRating product={product} />
        </div>

        <p className="text-sm text-muted-foreground truncate">
          {product.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <Suspense fallback={<div>Loading...</div>}>
            <ProductCardTimestamp
              productStartTime={product.available_time_starts}
              productEndTime={product.available_time_ends}
            />
          </Suspense>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <ProductCardAction product={product} />
      </div>
    </Card>
  );
}
