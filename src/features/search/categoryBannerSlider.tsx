"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface CategoryBannerProps {
  categories: Array<{
    id: number;
    name: string;
    banner_image: string;
  }>;
}

export function CategoryBannerSlider({ categories }: CategoryBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % categories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [categories.length]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + categories.length) % categories.length
    );
  };

  if (categories.length === 0) return null;

  return (
    <div className="relative w-full h-64 mb-8">
      {categories.map((category, index) => (
        <Card
          key={category.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <CardContent className="p-0 h-full">
            <CustomImage
              src={category.banner_image}
              alt={category.name}
              fill
              type={ImageType.CATEGORY_BANNER}
              className="rounded-lg bg-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded">
              <h2 className="text-white text-2xl font-bold">{category.name}</h2>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
