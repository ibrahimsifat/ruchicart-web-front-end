"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from "@/store/cartStore";
import { Product } from "@/types/product";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";

const ProductCardAction = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const t = useTranslations("home");
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
  );
};

export default ProductCardAction;

ProductCardAction.displayName = "ProductCardAction";
