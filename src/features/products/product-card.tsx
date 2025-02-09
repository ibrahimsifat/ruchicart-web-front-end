import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import type { Product } from "@/types/product";
import { Clock, Star } from "lucide-react";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from "@/store/cartStore";
import { Eye, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const t = useTranslations("home");
  const discountedPrice =
    product.discount_type === "percent"
      ? product.price - (product.price * product.discount) / 100
      : product.price - product.discount;

  const rating =
    product.rating.length > 0
      ? product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
        product.rating.length
      : 0;
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id.toString(),
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });
  };
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
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-primary">
              {product.rating.length > 0
                ? (
                    product.rating.reduce((acc, curr) => acc + curr, 0) /
                    product.rating.length
                  ).toFixed(1)
                : "N/A"}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground truncate">
          {product.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {product.available_time_starts} - {product.available_time_ends}
            </span>
          </div>
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

        <div className="pt-2 flex justify-between items-center gap-2">
          <Link href={`/products/${product.id}`} className="flex-grow">
            <Button
              variant="outline"
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-300"
            >
              <Eye className="mr-2 h-4 w-4" />
              {t("viewDetails")}
            </Button>
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="default"
                  className="h-10 w-10 bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
                  onClick={handleAddToCart}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to cart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
}
