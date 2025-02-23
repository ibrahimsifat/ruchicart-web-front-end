"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModalState } from "@/lib/hooks/product/useModalState";
import type { Product } from "@/types/product";
import { Eye, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { memo } from "react";
import { ProductPreviewModal } from "../product-preview/product-preview-modal";

interface ProductCardActionProps {
  product: Product;
  showAddToCart?: boolean;
}

export const ProductCardAction = memo(
  ({ product, showAddToCart = true }: ProductCardActionProps) => {
    const { isOpen, onOpen, onClose } = useModalState();
    const t = useTranslations("home");

    return (
      <>
        <div className="pt-2 flex justify-between items-center gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-grow"
            prefetch={false}
          >
            <Button
              variant="outline"
              className="w-full bg-primary/20 hover:bg-primary/20 text-primary-text transition-colors duration-300"
            >
              <Eye className="mr-2 h-4 w-4" />
              {t("viewDetails")}
            </Button>
          </Link>

          {showAddToCart && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="default"
                    className="h-12 w-12 rounded-full bg-primary text-primary-text-foreground hover:bg-primary transition-colors duration-300"
                    onClick={onOpen}
                    data-add-to-cart
                  >
                    <ShoppingCart className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <ProductPreviewModal
          open={isOpen}
          onOpenChange={onClose}
          product={product}
        />
      </>
    );
  }
);

ProductCardAction.displayName = "ProductCardAction";
