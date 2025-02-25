"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/components/ui/use-toast";
import {
  useLatestProducts,
  useRelatedProducts,
} from "@/lib/hooks/queries/product/useProducts";
import { useCart } from "@/store/cartStore";
import { Product } from "@/types/product";
import { useCallback, useMemo } from "react";
import { CartProductCard } from "./cart-product-card";

interface CartCarouselProps {
  productId?: number;
  isProductId?: boolean;
}

export function CartCarousel({ productId, isProductId }: CartCarouselProps) {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();
  const { data: latestProducts } = useLatestProducts();

  // Only call useRelatedProducts if isProductId is true and productId is provided
  const { data: relatedProducts, isLoading: relatedProductsLoading } =
    isProductId && productId
      ? useRelatedProducts(productId)
      : { data: undefined, isLoading: false };

  const carouselProducts = useMemo(() => {
    // If isProductId is false, only use latest products
    if (!isProductId) {
      return latestProducts?.products?.filter(
        (product) => !items.some((item) => item.id === product.id)
      );
    }

    // Otherwise, try related products first, then fall back to latest
    let filtered = relatedProducts?.filter(
      (product) => !items.some((item) => item.id === product.id)
    );

    if (!filtered?.length) {
      filtered = latestProducts?.products?.filter(
        (product) => !items.some((item) => item.id === product.id)
      );
    }
    return filtered;
  }, [isProductId, relatedProducts, latestProducts?.products, items]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        available_time_starts: product.available_time_starts,
        available_time_ends: product.available_time_ends,
        quantity: 1,
      });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    [addItem, toast]
  );

  // Return null if loading or no products available
  if (
    (isProductId && productId && relatedProductsLoading) ||
    !carouselProducts?.length
  ) {
    return null;
  }

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg mt-4">
      <h3 className="font-semibold text-2xl text-center">
        You might also like
      </h3>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {carouselProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <CartProductCard
                product={product}
                handleAddToCart={handleAddToCart}
                cartItem={items.find((item) => item.id === product.id)}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 bg-white shadow-md hover:bg-gray-100" />
        <CarouselNext className="hidden md:flex -right-12 bg-white shadow-md hover:bg-gray-100" />
      </Carousel>
    </div>
  );
}
