import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product";
import { Clock, Leaf, Star } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function SearchProductCard({ product }: ProductCardProps) {
  const discountedPrice =
    product.discount_type === "percent"
      ? product.price - product.price * (product.discount / 100)
      : product.price - product.discount;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        {product.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {product.discount_type === "percent"
              ? `${product.discount}% OFF`
              : `$${product.discount} OFF`}
          </Badge>
        )}
        {product.product_type === "veg" && (
          <Badge className="absolute top-2 left-2 bg-green-500">
            <Leaf className="h-4 w-4 mr-1" />
            Veg
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-sm font-medium">
              {product.rating.length > 0
                ? (
                    product.rating.reduce((acc, curr) => acc + curr, 0) /
                    product.rating.length
                  ).toFixed(1)
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {product.available_time_starts} - {product.available_time_ends}
            </span>
          </div>
        </div>
      </CardContent>
      <CardContent className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="text-lg font-bold">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through ml-2">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        <Button>Add to Cart</Button>
      </CardContent>
    </Card>
  );
}
