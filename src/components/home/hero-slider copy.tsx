"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBanners } from "@/lib/hooks/queries/banner/useBanners";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { ImageType } from "@/types/image";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import CustomImage from "../ui/customImage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function HeroSlider({ interval = 3000 }) {
  const { data: banners, isLoading, error } = useBanners();
  const { addItem } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!banners?.length) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, interval);

    return () => clearInterval(slideInterval);
  }, [banners?.length, interval]);

  return (
    <div className="relative overflow-hidden rounded-xl max-w-6xl mx-auto h-[400px] md:h-[500px]">
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${banners?.length ? banners.length * 100 : 100}%`,
        }}
      >
        {banners?.map((banner, index) => {
          const { product } = banner;
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
            <Card
              key={index}
              className={cn(
                "flex-shrink-0 w-full h-full p-4 md:p-8 bg-gradient-to-r from-yellow-50 to-blue-50"
              )}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 h-full">
                <div className="space-y-3 md:space-y-4 text-center md:text-left max-w-md">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                    {banner.title}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground line-clamp-3">
                    {product.description}
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="default"
                          variant="default"
                          className="bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
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
                </div>
                <div className="relative w-full md:w-1/2 h-[200px] md:h-full">
                  <CustomImage
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    type={ImageType.PRODUCT}
                    className="object-contain"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners?.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentSlide ? "bg-primary" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}
