"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from "@/store/cartStore";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";

function HeroSliderAction({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="default"
            variant="default"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
            onClick={handleAddToCart}
          >
            Order Now
            <ShoppingBag className="h-4 w-4 ml-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to cart</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default HeroSliderAction;
