import { cn } from "@/lib/utils/utils";
import { BannerItem } from "@/types/banner";
import { memo } from "react";
import { SlideAction } from "./SlideAction";
import { SlideImage } from "./SlideImage";

export const SlideContent = memo(function SlideContent({
  slide,
  isActive,
  priority = false,
}: {
  slide: BannerItem;
  isActive: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-700 ease-in-out", // Reduced animation time
        isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
      )}
    >
      <div className="w-full h-full bg-blue-100">
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
            priority={priority}
          />
        </div>
      </div>
    </div>
  );
});
