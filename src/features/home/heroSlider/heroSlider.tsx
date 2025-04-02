"use client";

import { BannerItem } from "@/types/banner";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SlideContent } from "./SlideContent";

const SLIDE_DURATION = 5000;

export const HeroSlider = memo(function HeroSlider({
  slides,
}: {
  slides: BannerItem[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = slides?.length ?? 0;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  }, [slidesCount]);

  // More efficient timer management
  useEffect(() => {
    if (!slidesCount) return;

    // Clear previous timer before setting a new one
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(nextSlide, SLIDE_DURATION);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [nextSlide, slidesCount]);

  if (!slides?.length) return null;

  return (
    <div className="relative w-full h-full">
      {slides.map((slide, index) => {
        // Only render slides that are currently visible or will be next
        const shouldRender =
          index === currentSlide || index === (currentSlide + 1) % slidesCount;

        return shouldRender ? (
          <SlideContent
            key={slide.title}
            slide={slide}
            isActive={index === currentSlide}
          />
        ) : null;
      })}
    </div>
  );
});
