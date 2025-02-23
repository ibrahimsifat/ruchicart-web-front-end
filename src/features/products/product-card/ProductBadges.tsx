import { Badge } from "@/components/ui/badge";
import defaultConfig from "@/config/config";
import { Product } from "@/types/product";
import { memo } from "react";

export const ProductBadges = memo(({ product }: { product: Product }) => (
  <>
    {product.is_recommended === 1 && (
      <Badge className="bg-primary absolute left-2 top-9">Recommended</Badge>
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
  </>
));

ProductBadges.displayName = "ProductBadges";
