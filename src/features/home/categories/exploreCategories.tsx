"use client";

import SectionHeaderSkeleton from "@/components/skeleton/SectionHeaderSkeleton";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { SectionHeader } from "@/components/ui/section-header";
import { getCategoryBGGradient } from "@/components/utils/getCategoryBGGradient";
import { cn } from "@/lib/utils/utils";
import { Category } from "@/types";
import { ImageType } from "@/types/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";

export function ExploreCategories({ categories }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const t = useTranslations("home");

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

  return (
    <div ref={containerRef} className="relative mt-6">
      <section>
        <Suspense fallback={<SectionHeaderSkeleton />}>
          <SectionHeader
            title={t("exploreCategories")}
            description={t("whatAreYouCravingToday")}
            action={
              <Link
                href="/categories"
                className="text-primary hover:text-primary/80 font-bold md:text-lg text-xl mb-2"
              >
                {t("viewAll")}
              </Link>
            }
          />
        </Suspense>
        {
          <div
            ref={gridRef}
            className={cn(
              "grid grid-cols-6 lg:grid-cols-6 gap-4 transition-all duration-500 ease-in-out",
              isSticky &&
                "fixed lg:top-6 top-10 left-0 right-0 z-40 gap-0 bg-background/70 backdrop-blur-sm mx-auto max-w-7xl rounded-lg lg:h-44 h-26"
            )}
          >
            {categories?.map((category: Category) => (
              <Link
                key={category.id}
                href={`/products?category_id=${category.id}`}
                prefetch
              >
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
        }
      </section>
    </div>
  );
}
