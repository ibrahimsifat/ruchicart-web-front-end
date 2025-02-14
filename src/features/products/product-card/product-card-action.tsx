"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Product } from "@/types/product";
import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductPreviewModal } from "../product-preview-modal";

const ProductCardAction = ({
  product,
  showAddToCart = true,
}: {
  product: Product;
  showAddToCart?: boolean;
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const t = useTranslations("home");

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

      {showAddToCart && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="default"
                className="h-12 w-12 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
                onClick={() => setShowPreview(true)}
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

      {/* <TooltipProvider>
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
      </TooltipProvider> */}
      {/* <div className="">
        {cartItem ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center space-x-2"
          >
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full"
              onClick={() => {
                if (cartItem.quantity > 1) {
                  updateQuantity(product.id, cartItem.quantity - 1);
                } else {
                  removeItem(product.id);
                }
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItem.quantity}
              </span>
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full"
              onClick={() => {
                updateQuantity(product.id, cartItem.quantity + 1);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="default"
                    className="h-12 w-12 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
                    onClick={handleAddToCart}
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
          </motion.div>
        )}
      </div> */}

      <ProductPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        product={product}
      />
    </div>
  );
};

export default ProductCardAction;

ProductCardAction.displayName = "ProductCardAction";
