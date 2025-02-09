"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeader } from "@/components/ui/section-header";
import { CartIconRef } from "@/features/layout/navbar";
import { ProductCard } from "@/features/products/product-card";
import { Link } from "@/i18n/routing";
import { useLatestProducts } from "@/lib/hooks/queries/product/useProducts";
import { Product } from "@/types/product";
import { useTranslations } from "next-intl";

export function FeaturedProducts() {
  const { data: productsData, isLoading, error } = useLatestProducts();
  const products = productsData?.products;
  const t = useTranslations("home");
  return (
    <CartIconRef.Provider value={null}>
      <section className="py-12">
        <SectionHeader
          title={t("featuredProducts")}
          description={t("discoverPopular")}
          action={
            <Link
              href="/products"
              className="text-primary hover:text-primary/80 font-bold md:text-lg text-xl mb-2"
            >
              {t("viewAll")}
            </Link>
          }
        />
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {products?.map((product: Product) => (
              <CarouselItem
                key={product.id}
                className="md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={product as Product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </CartIconRef.Provider>
  );
}
