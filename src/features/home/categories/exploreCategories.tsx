"use client";

import SectionHeaderSkeleton from "@/components/skeleton/SectionHeaderSkeleton";
import CustomImage from "@/components/ui/customImage";
import { SectionHeader } from "@/components/ui/section-header";
import { getCategoryBGGradient } from "@/components/utils/getCategoryBGGradient";
import { debounce } from "@/lib/hooks/useDebounce";
import { cn } from "@/lib/utils/utils";
import { Category } from "@/types";
import { ImageType } from "@/types/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";

export function ExploreCategories({ categories }: { categories: Category[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const t = useTranslations("home");
  const [isMounted, setIsMounted] = useState(false);

  // Safely initialize gradients after client-side mounting
  const [categoryGradients, setCategoryGradients] = useState<string[]>([]);

  // Set mounted state after initial render
  useEffect(() => {
    setIsMounted(true);

    // Generate stable gradients for each category once
    if (categories?.length && categoryGradients.length === 0) {
      const gradients = categories.map(() => getCategoryBGGradient());
      setCategoryGradients(gradients);
    }
  }, [categories, categoryGradients.length]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      setIsSticky(containerRect.top <= 30);
    }, 10);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel(); // Cancel the debounced function on cleanup
    };
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
                className="text-primary-text hover:text-primary-text/80 font-bold md:text-lg text-xl mb-2"
              >
                {t("viewAll")}
              </Link>
            }
          />
        </Suspense>
        {
          <div
            className={cn(
              "grid md:grid-cols-4 grid-cols-3 lg:grid-cols-6 gap-4 transition-all duration-500 ease-in-out",
              isMounted &&
                isSticky &&
                "lg:flex d-none lg:fixed static lg:top-6 top-8 left-0 right-0 z-40 bg-background/70 backdrop-blur-sm mx-auto max-w-7xl rounded-lg lg:h-40 h-24 "
            )}
          >
            {categories?.map((category: Category, index: number) => (
              <Link
                key={category.id}
                href={`/products?category_id=${category.id}`}
                prefetch
              >
                <div
                  key={category.name}
                  className={cn(
                    "group transition-all duration-500 cursor-pointer overflow-hidden",
                    // Only apply dynamic gradients after client-side hydration
                    isMounted
                      ? categoryGradients[index] || "bg-gray-100"
                      : "bg-gray-100",
                    isMounted && isSticky
                      ? "lg:rounded-full scale-50"
                      : "rounded-lg"
                  )}
                >
                  <div
                    className={cn(
                      "p-4 flex flex-col items-center justify-center aspect-square transition-all duration-500",
                      isMounted && isSticky && "lg:scale-100 p-0"
                    )}
                  >
                    <CustomImage
                      src={category.image}
                      type={ImageType.CATEGORY}
                      width={200}
                      height={200}
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-300",
                        isMounted && isSticky ? "scale-100" : "mb-2"
                      )}
                      alt={`${category.name} category`}
                    />
                    {!(isMounted && isSticky) && (
                      <span
                        className={cn(
                          "font-medium md:text-md text-sm text-center group-hover:font-bold transition-all duration-300 h-9"
                        )}
                      >
                        {category.name}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        }
      </section>
    </div>
  );
}
