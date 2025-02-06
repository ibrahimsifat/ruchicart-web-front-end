"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { CartIconRef } from "@/features/layout/navbar";
import { useLatestProducts } from "@/lib/hooks/queries/product/useProducts";
import { Product } from "@/types/product";

export function FeaturedProducts() {
  const { data: productsData, isLoading, error } = useLatestProducts();
  const products = productsData?.products;
  return (
    <CartIconRef.Provider value={null}>
      <section className="py-12">
        <SectionHeader
          title="Featured Products"
          description="Discover our most popular dishes"
          action={<Button variant="link">View All</Button>}
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
