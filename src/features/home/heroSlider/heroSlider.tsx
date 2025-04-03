"use client";

import { useBanners } from "@/lib/hooks/queries/banner/useBanners";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { SlideContent } from "./SlideContent";

const SLIDE_DURATION = 5000;

export const HeroSlider = memo(function HeroSlider() {
  const { data: banners } = useBanners();
  console.log(banners);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = banners?.length ?? 0;
  const slides = banners;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  }, [slidesCount]);

  // Reset the timer when slide changes to ensure consistent timing
  useEffect(() => {
    if (!slidesCount) return;

    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set new timer
    timerRef.current = setInterval(nextSlide, SLIDE_DURATION);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [nextSlide, slidesCount, currentSlide]);

  if (!slides?.length) return null;

  // Preload next slide image
  const nextSlideIndex = (currentSlide + 1) % slidesCount;

  return (
    <div className="relative overflow-hidden rounded-b-xl h-[400px] md:h-[500px]">
      <div className="relative w-full h-full">
        {/* Preload next image */}
        {slides[nextSlideIndex] && (
          <link
            rel="preload"
            href={slides[nextSlideIndex].product.image}
            as="image"
          />
        )}

        {/* Only render current and next slide for better performance */}
        {slides.map((slide, index) => {
          // Only render current slide and the next one to reduce DOM elements
          if (index !== currentSlide && index !== nextSlideIndex) return null;

          return (
            <SlideContent
              key={slide.title}
              slide={slide}
              isActive={index === currentSlide}
              priority={index === currentSlide}
            />
          );
        })}
      </div>
    </div>
  );
});
