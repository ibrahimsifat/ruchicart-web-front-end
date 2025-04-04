"use client";

import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  banner_image: string;
}

interface CategoryBannersProps {
  categories: Category[];
}

export function CategoryBanners({ categories }: CategoryBannersProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % categories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [categories.length]);

  return (
    <div className="relative overflow-hidden rounded-lg h-[300px]">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {categories.map((category) => (
          <div key={category.id} className="w-full flex-shrink-0">
            <Link href={`/products?category_id=${category.id}`}>
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
                <CustomImage
                  type={ImageType.CATEGORY_BANNER}
                  src={category.banner_image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {categories.map((_, idx) => (
          <button
            key={idx}
            className={`h-2 w-2 rounded-full transition-colors ${
              idx === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
}
