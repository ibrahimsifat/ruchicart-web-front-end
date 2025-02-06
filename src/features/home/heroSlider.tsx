"use client";
import { Card } from "@/components/ui/card";
import { useBanners } from "@/lib/hooks/queries/banner/useBanners";
import { cn } from "@/lib/utils/utils";
import { useCart } from "@/store/cartStore";
import { ImageType } from "@/types/image";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import CustomImage from "../../components/ui/customImage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: slides, isLoading, error } = useBanners();
  const { addItem } = useCart();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % (slides?.length || 0));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides]);

  return (
    <div className="relative overflow-hidden rounded-xl h-[400px] md:h-[500px] mb-10">
      {slides?.map((slide, index) => {
        const { product } = slide;
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
              "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
              "bg-blue-100",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="flex flex-col md:flex-row items-center justify-between h-full p-8 md:p-12">
              <div className="space-y-4 text-center md:text-left max-w-lg">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {slide?.title}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                  {slide?.product.description.slice(0, 100)}...
                </p>

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
              </div>
              <div className="relative w-full md:w-1/2 h-48 md:h-full mt-8 md:mt-0">
                <CustomImage
                  src={slide.product.image || "/placeholder.svg"}
                  alt={slide.title}
                  type={ImageType.PRODUCT}
                  fill
                  className="object-contain opacity-0 transition-opacity duration-500 ease-in-out"
                  onLoad={(event) => {
                    const img = event.target as HTMLImageElement;
                    img.classList.remove("opacity-0");
                  }}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
