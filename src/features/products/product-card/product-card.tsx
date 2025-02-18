import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Product } from "@/types/product";

import defaultConfig from "@/config/config";
import { getDiscountedPrice } from "@/lib/utils/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import ProductCardAction from "./product-card-action";
import ProductCardImage from "./product-card-image";
import ProductCardRating from "./product-card-rating";
const ProductCardTimestamp = dynamic(() => import("./product-card-timestamp"), {
  loading: () => (
    <div className="flex items-center gap-1 text-muted-foreground animate-pulse">
      <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-200 rounded-full" />
      <div className="w-24 h-4 bg-gray-200 rounded" />
    </div>
  ),
});

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden w-[90%] h-[90%] mx-auto">
        <ProductCardImage product={product} />
        {product.is_recommended === 1 && (
          <Badge className="bg-primary absolute left-2 top-9">
            Recommended
          </Badge>
        )}

        {product.discount > 0 && (
          <Badge variant="destructive" className="absolute right-2 bottom-2">
            {product.discount_type === "percent"
              ? `${product.discount}% OFF`
              : `${defaultConfig.currency_symbol}${product.discount} OFF`}
          </Badge>
        )}
        {product.product_type === "veg" && (
          <Badge variant="secondary" className="absolute left-2 top-2">
            Veg
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          </Link>
          <ProductCardRating product={product} />
        </div>

        <p className="text-sm text-muted-foreground truncate">
          {product.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <ProductCardTimestamp
            productStartTime={product.available_time_starts}
            productEndTime={product.available_time_ends}
          />

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              {defaultConfig.currency_symbol}
              {getDiscountedPrice({
                price: product.price,
                discount: product.discount,
                discount_type: product.discount_type,
              })}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {defaultConfig.currency_symbol}
                {product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <ProductCardAction product={product} />
      </div>
    </Card>
  );
}
