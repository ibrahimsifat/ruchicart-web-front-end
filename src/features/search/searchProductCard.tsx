"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { Product } from "@/types/product";
import { Clock, Heart, Leaf, Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function SearchProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const { toast } = useToast();
  const discountedPrice =
    product.discount_type === "percent"
      ? product.price - product.price * (product.discount / 100)
      : product.price - product.discount;

  const handleAddToCart = () => {
    // Add to cart logic here
    toast({
      title: "Added to cart",
      description: `${quantity} ${product.name} added to your cart.`,
    });
    setQuantity(0);
  };

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
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2"
          onClick={() => toast({ title: "Added to favorites" })}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
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
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
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
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(0, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="mx-2 min-w-[1.5rem] text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            className="ml-2"
            onClick={handleAddToCart}
            disabled={quantity === 0}
          >
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
