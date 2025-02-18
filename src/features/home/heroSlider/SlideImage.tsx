import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import { memo } from "react";

export const SlideImage = memo(function SlideImage({
  src,
  alt,
  isActive,
}: {
  src: string;
  alt: string;
  isActive: boolean;
}) {
  return (
    <div className="relative w-full md:w-1/2 h-48 md:h-full mt-8 md:mt-0">
      <CustomImage
        src={src || "/placeholder.svg"}
        alt={alt}
        type={ImageType.PRODUCT}
        fill
        className="object-contain opacity-0 transition-opacity duration-500 ease-in-out"
        onLoad={(event) => {
          const img = event.target as HTMLImageElement;
          img.classList.remove("opacity-0");
        }}
        loading={isActive ? "eager" : "lazy"}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
});
