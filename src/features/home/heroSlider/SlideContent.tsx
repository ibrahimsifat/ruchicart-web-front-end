import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import { BannerItem } from "@/types/banner";
import { memo } from "react";
import { SlideAction } from "./SlideAction";
import { SlideImage } from "./SlideImage";

export const SlideContent = memo(function SlideContent({
  slide,
  isActive,
}: {
  slide: BannerItem;
  isActive: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
        isActive ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <Card className="w-full h-full bg-blue-100">
        <div className="flex flex-col md:flex-row items-center justify-between h-full p-8 md:p-12">
          <div className="space-y-4 text-center md:text-left max-w-lg">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {slide.title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              {slide.product.description.slice(0, 100)}...
            </p>
            <SlideAction product={slide.product} />
          </div>
          <SlideImage
            src={slide.product.image}
            alt={slide.title}
            isActive={isActive}
          />
        </div>
      </Card>
    </div>
  );
});
