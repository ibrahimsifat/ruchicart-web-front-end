import { ProductCardProps } from "@/types/product";
import { memo } from "react";
import { ProductAvailability } from "./ProductAvailability";
import { ProductDescription } from "./ProductDescription";
import { ProductPrice } from "./ProductPrice";
import { ProductRating } from "./ProductRating";
import { ProductTitle } from "./ProductTitle";
import { ProductCardAction } from "./product-card-action";

export const ProductCardContent = memo(
  ({ product, showAddToCart }: ProductCardProps) => (
    <div className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <ProductTitle id={product.id} name={product.name} />
        <ProductRating rating={product.rating} />
      </div>
      <ProductDescription description={product.description} />
      <div className="flex items-center justify-between text-sm">
        <ProductAvailability
          startTime={product.available_time_starts}
          endTime={product.available_time_ends}
        />
        <ProductPrice
          price={product.price}
          discount={product.discount}
          discountType={product.discount_type}
        />
      </div>
      <ProductCardAction product={product} showAddToCart={showAddToCart} />
    </div>
  )
);

ProductCardContent.displayName = "ProductCardContent";
