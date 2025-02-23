import defaultConfig from "@/config/config";
import { getDiscountedPrice } from "@/lib/utils/utils";
import { memo } from "react";

interface ProductPriceProps {
  price: number;
  discount: number;
  discountType: string;
}

export const ProductPrice = memo(
  ({ price, discount, discountType }: ProductPriceProps) => (
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-bold">
        {defaultConfig.currency_symbol}
        {getDiscountedPrice({
          price,
          discount,
          discount_type: discountType,
        })}
      </span>
      {discount > 0 && (
        <span className="text-sm text-muted-foreground line-through">
          {defaultConfig.currency_symbol}
          {price.toFixed(2)}
        </span>
      )}
    </div>
  )
);

ProductPrice.displayName = "ProductPrice";
