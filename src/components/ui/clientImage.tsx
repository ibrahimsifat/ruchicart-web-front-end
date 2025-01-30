"use client";

import { getImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import { ImageProps, ImageType } from "@/types/image";
import Image from "next/image";
import React from "react";

const ClientImage = ({
  src,
  type = ImageType.CATEGORY,
  alt = "image",
  width = 0,
  height = 0,
  className = "",
  fallback = "/placeholder.png",
  priority = false,
  fill = false,
  ...props
}: ImageProps) => {
  const [error, setError] = React.useState(false);
  const imageUrl = error ? fallback : getImageUrl(src, type);

  const imageProps = {
    src: imageUrl,
    alt,
    onError: () => setError(true),
    priority,
    className: cn("object-cover", className),
    ...(!fill ? { width, height } : { fill: true }),
    ...props,
  };

  return <Image {...imageProps} />;
};

export default ClientImage;
