"use client";

import { AddToCartAnimation } from "@/components/ui/add-to-cart-animation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductPreviewModal } from "@/components/ui/product-preview-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CartIconRef } from "@/features/layout/navbar";
import { useCart } from "@/store/cartStore";
import { ImageType } from "@/types/image";
import { motion } from "framer-motion";
import { Clock, Eye, Heart, Plus, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useContext, useRef, useState } from "react";
import CustomImage from "./customImage";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    variations: Array<{
      name: string;
      type: string;
      min: string;
      max: string;
      required: string;
      values: Array<{
        label: string;
        optionPrice: string;
      }>;
    }>;
    discount: number;
    discount_type: string;
    available_time_starts: string;
    available_time_ends: string;
    product_type: string;
    is_recommended: number;
    rating: any[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const cartIconRef = useContext(CartIconRef);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id.toString(),
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const discountedPrice =
    product.discount_type === "percent"
      ? product.price - product.price * (product.discount / 100)
      : product.price - product.discount;

  return (
    <motion.div
      ref={cardRef}
      className="group relative cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setShowPreview(true)}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        <CustomImage
          type={ImageType.PRODUCT}
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.is_recommended === 1 && (
            <Badge className="bg-primary">Recommended</Badge>
          )}
          {product.discount > 0 && (
            <Badge variant="destructive">
              {product.discount_type === "percent"
                ? `${product.discount}% OFF`
                : `$${product.discount} OFF`}
            </Badge>
          )}
          <Badge variant="secondary">{product.product_type}</Badge>
        </div>

        {/* Quick Add Button */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            size="sm"
            className="bg-white text-black hover:bg-white/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </motion.div>

        {/* Wishlist Button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            // Add wishlist logic
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
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
          <Link href={`/product/${product.id}`} className="flex-grow">
            <Button
              variant="outline"
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-300"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
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

      {showAnimation && cartIconRef && (
        <AddToCartAnimation
          productImage={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`}
          productName={product.name}
          targetRef={cartIconRef as React.RefObject<HTMLElement>}
        />
      )}

      <ProductPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        product={{
          ...product,
          id: product.id.toString(),
        }}
      />
    </motion.div>
  );
}
