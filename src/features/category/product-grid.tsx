"use client";

import { Card } from "@/components/ui/card";
import { ImageType } from "@/types/image";
import { Product } from "@/types/product";
import { Star } from "lucide-react";
import CustomImage from "../../components/ui/customImage";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <CustomImage
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                type={ImageType.PRODUCT}
                fill
                className=""
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold">{product.name}</h3>
              {/* <p className="text-sm text-muted-foreground">
                {product.restaurant}
              </p> */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    {product.rating}
                  </span>
                  {/* <span className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {product.deliveryTime} min
                  </span> */}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
