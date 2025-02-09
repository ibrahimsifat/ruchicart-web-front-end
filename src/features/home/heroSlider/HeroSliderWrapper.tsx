"use client";

import { cn } from "@/lib/utils/utils";
import { BannerItem } from "@/types/banner";
import { useEffect, useState } from "react";
import HeroSliderContent from "./HeroSliderContent";

function HeroSliderWrapper({ slides }: { slides: BannerItem[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!slides) return;

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides]);

  return (
    <div className="relative w-full h-full">
      {slides?.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <HeroSliderContent slide={slide} />
        </div>
      ))}
    </div>
  );
}

export default HeroSliderWrapper;
