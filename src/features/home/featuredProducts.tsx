"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductCard } from "@/features/products/product-card";
import { Link } from "@/i18n/routing";
import { useLatestProducts } from "@/lib/hooks/queries/product/useProducts";
import { Product } from "@/types/product";
import { useTranslations } from "next-intl";

interface GetPopularOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export function FeaturedProducts() {
  const { data: productData } = useLatestProducts();
  const products = productData?.products;

  const t = useTranslations("home");
  return (
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
  );
}
