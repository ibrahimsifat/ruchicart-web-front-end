import { getImageUrl } from "@/lib/utils/image";
import { cn } from "@/lib/utils/utils";
import { ImageType } from "@/types/image";
import Image, { ImageProps } from "next/image";
import { memo } from "react";

const BLUR_DATA = {
  default:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y2ZjdmOCIvPjwvc3ZnPg==",
  small:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZjZmN2Y4Ii8+PC9zdmc+",
  large:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y2ZjdmOCIvPjwvc3ZnPg==",
} as const;

interface CustomImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string;
  type?: ImageType;
  alt: string;
}

const getBlurDataURL = (
  width: string | number | undefined,
  fill: boolean
): string => {
  if (fill) return BLUR_DATA.default;

  const numWidth = typeof width === "string" ? parseInt(width, 10) : width;

  if (!numWidth || isNaN(numWidth)) return BLUR_DATA.default;
  if (numWidth <= 50) return BLUR_DATA.small;
  if (numWidth >= 200) return BLUR_DATA.large;
  return BLUR_DATA.default;
};

const CustomImage = memo(function CustomImage({
  src,
  type = ImageType.CATEGORY,
  alt,
  className,
  width = 0,
  height = 0,
  fill = false,
  quality = 75,
  priority = false,
  sizes = "100vw",
  ...props
}: CustomImageProps) {
  const imageProps = {
    src: src ? getImageUrl(src, type) : "",
    alt,
    quality,
    priority,
    loading: priority ? undefined : ("lazy" as const),
    decoding: "async" as const,
    className: cn("object-cover", className),
    placeholder: "blur" as const,
    blurDataURL: getBlurDataURL(width, fill),
    ...(fill ? { fill, sizes } : { width, height }),
    ...props,
  };

  return <Image {...imageProps} />;
});

export default CustomImage;
