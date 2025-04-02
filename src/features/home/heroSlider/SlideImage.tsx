import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";

import { memo, useState } from "react";

export const SlideImage = memo(function SlideImage({
  src,
  alt,
  isActive,
  priority = false,
}: {
  src: string;
  alt: string;
  isActive: boolean;
  priority?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full md:w-1/2 h-48 md:h-full mt-8 md:mt-0">
      <CustomImage
        type={ImageType.PRODUCT}
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className={`object-contain `}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
});
