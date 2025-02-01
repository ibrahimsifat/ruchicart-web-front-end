"use client";

import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { CategorySkeleton } from "@/features/category/CategorySkeleton";
import { useCategories } from "@/lib/hooks/queries/category/useCategories";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { ImageType } from "@/types/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CustomImage from "../../components/ui/customImage";
import { getCategoryBGGradient } from "../../components/utils/getCategoryBGGradient";

export function ExploreCategories() {
  const { data: categories, isLoading, error } = useCategories();
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (gridRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const gridRect = gridRef.current.getBoundingClientRect();

        // Check if we've scrolled past the container's top
        setIsSticky(containerRect.top <= 30);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (error) {
    console.error(error);
    return <div>Error loading categories</div>;
  }

  return (
    <div ref={containerRef} className="relative">
      <section className="">
        <SectionHeader
          title="Explore Categories"
          description="What are you craving today?"
        />
        <div
          ref={gridRef}
          className={cn(
            "grid grid-cols-6 lg:grid-cols-6 gap-4 transition-all duration-500 ease-in-out",

            isSticky &&
              "fixed lg:top-6 top-10 left-0 right-0 z-40 gap-0 bg-background/70 backdrop-blur-sm mx-auto max-w-7xl rounded-lg lg:h-44 h-26"
          )}
        >
          {categories?.map((category: Category) => (
            <Link key={category.name} href={`/categories/${category.id}`}>
              <Card
                key={category.name}
                className={cn(
                  "group transition-all duration-500 cursor-pointer overflow-hidden",

                  getCategoryBGGradient(),
                  isSticky ? "rounded-full scale-50" : "rounded-lg"
                )}
              >
                <div
                  className={cn(
                    "p-4 flex flex-col items-center justify-center aspect-square transition-all duration-500",
                    isSticky && "scale-100 p-0"
                  )}
                >
                  <CustomImage
                    src={category.image}
                    type={ImageType.CATEGORY}
                    width={200}
                    height={200}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-300",
                      isSticky ? "scale-100" : "mb-2"
                    )}
                    alt={`${category.name} category`}
                  />
                  {!isSticky && (
                    <span
                      className={cn(
                        "font-medium md:text-md text-sm text-center group-hover:font-bold transition-all duration-300 h-9"
                      )}
                    >
                      {category.name}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
