import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ImageType } from "@/types/image";
import type { Product } from "@/types/product";
import { Star } from "lucide-react";
import Link from "next/link";
import ProductCardAction from "./product-card/product-card-action";
import ProductCartWishlist from "./product-card/product-cart-wishlist";

interface ProductListItemProps {
  product: Product;
  isAvailable: boolean;
}

export function ProductListItem({
  product,
  isAvailable,
}: ProductListItemProps) {
  const rating =
    product.rating.reduce((a, b) => a + b, 0) / product.rating.length;
  const discountedPrice =
    product.discount > 0 ? product.price - product.discount : product.price;

  return (
    <Card className="overflow-hidden">
      <div className="flex gap-6 p-4">
        <Link
          href={`/product/${product.id}`}
          className="relative aspect-square h-40 overflow-hidden rounded-lg"
        >
          <CustomImage
            type={ImageType.PRODUCT}
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
          {product.discount > 0 && (
            <Badge variant="destructive" className="absolute right-2 top-2">
              {product.discount_type === "percent"
                ? `${product.discount}% OFF`
                : `$${product.discount} OFF`}
            </Badge>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge variant="destructive" className="text-lg">
                Out of Stock
              </Badge>
            </div>
          )}
        </Link>

        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-4">
            <div>
              <Link href={`/product/${product.id}`} className="hover:underline">
                <h3 className="text-xl font-semibold">{product.name}</h3>
              </Link>
              <CardDescription className="mt-2 line-clamp-2">
                {product.description}
              </CardDescription>
            </div>

            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                ({product.rating.length} reviews)
              </span>
            </div>
          </div>

          <CardFooter className="flex items-center justify-between px-0">
            <div className="space-x-2">
              <span className="text-2xl font-bold">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <ProductCartWishlist />

                <ProductCardAction product={product} />
              </TooltipProvider>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
