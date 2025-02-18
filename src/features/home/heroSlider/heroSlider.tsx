"use client";

import { BannerItem } from "@/types/banner";
import { memo, useCallback, useEffect, useState } from "react";
import { SlideContent } from "./SlideContent";

const SLIDE_DURATION = 5000;

export const HeroSlider = memo(function HeroSlider({
  slides,
}: {
  slides: BannerItem[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = slides?.length ?? 0;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  }, [slidesCount]);

  useEffect(() => {
    if (!slidesCount) return;

    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide, slidesCount]);

  if (!slides?.length) return null;

  return (
    <div className="relative w-full h-full">
      {slides.map((slide, index) => (
        <SlideContent
          key={slide.title}
          slide={slide}
          isActive={index === currentSlide}
        />
      ))}
    </div>
  );
});
