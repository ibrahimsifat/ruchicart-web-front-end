"use client";

import { CartIconRef } from "@/components/layout/navbar";
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
import { useCart } from "@/store/cart";
import { ImageType } from "@/types/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import CustomImage from "./customImage";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    restaurant: string;
    image: string;
    images: string[];
    price: number;
    rating: number;
    deliveryTime: string;
    isNew?: boolean;
    discount?: number;
    isVegetarian?: boolean;
    addOns?: Array<{
      id: string;
      name: string;
      price: number;
      description?: string;
      image?: string;
    }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const cartIconRef = useContext(CartIconRef);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && product.images && product.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % product.images!.length
        );
      }, 3000); // Change image every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isHovered, product.images]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + product.images!.length) % product.images!.length
      );
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % product.images!.length
      );
    }
  };

  return (
    <>
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
          <AnimatePresence initial={false} custom={currentImageIndex}>
            <motion.div
              key={currentImageIndex}
              custom={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* <Image
                src={
                  product.images && product.images.length > 0
                    ? product.images[currentImageIndex]
                    : product.image || "/placeholder.svg"
                }
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
              /> */}

              <CustomImage
                src={
                  product.images && product.images.length > 0
                    ? product.images[currentImageIndex]
                    : product.image || "/placeholder.svg"
                }
                type={ImageType.PRODUCT}
                fill
                className="object-cover"
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
              />
            </motion.div>
          </AnimatePresence>

          {/* Image Navigation */}
          {isHovered && product.images && product.images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md transition-opacity duration-300"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md transition-opacity duration-300"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </button>
            </>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && <Badge className="bg-primary">New</Badge>}
            {product.discount && (
              <Badge variant="destructive">{product.discount}% OFF</Badge>
            )}
          </div>

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
                {product.rating}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground truncate">
            {product.restaurant}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{product.deliveryTime} min</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.discount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center gap-2">
            <Link href={`/products/${product.id}`} className="flex-grow">
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
            productImage={product.image}
            productName={product.name}
            targetRef={cartIconRef}
          />
        )}
      </motion.div>

      <ProductPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        product={{
          ...product,
          originalPrice: product.discount
            ? product.price * (1 + product.discount / 100)
            : undefined,
        }}
      />
    </>
  );
}
