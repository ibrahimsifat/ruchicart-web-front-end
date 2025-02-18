"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import defaultConfig from "@/config/config";
import { getDiscountedPrice } from "@/lib/utils/utils";
import { ImageType } from "@/types/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useMemo } from "react";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  discount?: number;
  discount_type?: string;
}

interface CartCarouselProps {
  productId: number;
}

// Memoized Price Component
const ProductPrice = memo(
  ({
    price,
    discount,
    discount_type,
  }: {
    price: number;
    discount?: number;
    discount_type?: string;
  }) => {
    const discountedPrice = useMemo(
      () =>
        getDiscountedPrice({
          price,
          discount: discount || 0,
          discount_type: discount_type || "percent",
        }),
      [price, discount, discount_type]
    );

    return (
      <Badge
        variant="default"
        className="absolute bottom-0 left-1 text-sm md:text-base font-semibold"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-md font-bold">${discountedPrice}</span>
          {discount && discount > 0 && (
            <span className="text-sm text-white line-through">
              ${price !== 0 && price.toFixed(2)}
            </span>
          )}
        </div>
      </Badge>
    );
  }
);

ProductPrice.displayName = "ProductPrice";

// Memoized Cart Controls Component
const CartControls = memo(
  ({
    cartItem,
    productId,
    updateQuantity,
    removeItem,
  }: {
    cartItem: any;
    productId: number;
    updateQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
  }) => {
    const handleDecrease = useCallback(() => {
      if (cartItem.quantity > 1) {
        updateQuantity(productId, cartItem.quantity - 1);
      } else {
        removeItem(productId);
      }
    }, [cartItem.quantity, productId, updateQuantity, removeItem]);

    const handleIncrease = useCallback(() => {
      updateQuantity(productId, cartItem.quantity + 1);
    }, [cartItem.quantity, productId, updateQuantity]);

    return (
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
          className="h-8 w-8 rounded-full"
          onClick={handleDecrease}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-semibold">{cartItem.quantity}</span>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          onClick={handleIncrease}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }
);

CartControls.displayName = "CartControls";

export const CartProductCard = memo(
  ({
    product,
    handleAddToCart,
    cartItem,
    updateQuantity,
    removeItem,
  }: {
    product: Product;
    handleAddToCart: (product: Product) => void;
    cartItem: any;
    updateQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
  }) => {
    const handleAdd = useCallback(() => {
      handleAddToCart(product);
    }, [product, handleAddToCart]);

    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-0">
          <Link href={`/products/${product.id}`} prefetch={true}>
            <div className="relative aspect-square">
              <CustomImage
                type={ImageType.PRODUCT}
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              {product.discount && product.discount > 0 && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  {product.discount_type === "percent"
                    ? `${product.discount}% OFF`
                    : `${defaultConfig.currency_symbol}${product.discount} OFF`}
                </Badge>
              )}
              <ProductPrice
                price={product.price}
                discount={product.discount}
                discount_type={product.discount_type}
              />
            </div>
          </Link>
          <div className="p-4 flex flex-col space-y-2">
            <h4 className="font-medium text-lg truncate">{product.name}</h4>
            <div className="flex justify-between items-center">
              <AnimatePresence mode="wait">
                {cartItem ? (
                  <CartControls
                    key="controls"
                    cartItem={cartItem}
                    productId={product.id}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ) : (
                  <motion.div
                    key="add"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
                            onClick={handleAdd}
                            data-add-to-cart
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add to cart</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

CartProductCard.displayName = "CartProductCard"; // Memoized Product Card Component
