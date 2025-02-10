import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeader } from "@/components/ui/section-header";
import { Link } from "@/i18n/routing";
import { fetchData } from "@/lib/api/fetchUtils";
import { Product, ProductResponse } from "@/types/product";
import { getTranslations } from "next-intl/server";
import { ProductCard } from "../products/product-card";

interface GetPopularOptions {
  page?: number;
  limit?: number;
  search?: string;
}
export async function getPopularProducts(options: GetPopularOptions = {}) {
  "use cache";
  return fetchData<ProductResponse>("/products/popular", { params: options });
}
export async function TrendingDishes() {
  const productsData = await getPopularProducts();
  const products = productsData?.products;
  const t = await getTranslations("home");
  return (
    <section className="py-12">
      <SectionHeader
        title={t("trendingNow")}
        description={t("mostOrderedDishesNearYou")}
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
