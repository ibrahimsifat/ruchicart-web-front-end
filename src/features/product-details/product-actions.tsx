"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/store/cartStore";
import { Product } from "@/types/product";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-xl font-semibold">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex space-x-4">
        <Button className="flex-1" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button variant="outline" size="icon">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
