import { ProductsLoading } from "@/components/skeleton/products-loading";
import { HeroSkeleton } from "@/components/ui/skeletons";
import { CategoryBanners } from "@/features/products/category-banners";
import { ProductFilters } from "@/features/products/product-filters";
import { ProductGrid } from "@/features/products/product-grid";
import PageLayout from "@/layouts/pageLayout";
import { getRecommendedData, searchProducts } from "@/lib/api/products";
import { Suspense } from "react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Suspense fallback={<div>Loading category...</div>}>
      <ProductsPageWrapper searchParams={searchParams} />
    </Suspense>
  );
}

const ProductsPageWrapper = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const params = await searchParams;
  const recommendedData = await getRecommendedData();
  const initialProducts = await searchProducts({
    limit: 12,
    offset: 0,
    ...params,
  });

  return (
    <PageLayout>
      <Suspense fallback={<HeroSkeleton />}>
        <CategoryBanners categories={recommendedData.categories.slice(1, 4)} />
      </Suspense>

      <div className="mt-8 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        <Suspense fallback={<div>Loading filters...</div>}>
          <ProductFilters
            categories={recommendedData.categories}
            cuisines={recommendedData.cuisines}
            maxPrice={initialProducts.product_max_price}
          />
        </Suspense>

        <Suspense fallback={<ProductsLoading />}>
          <ProductGrid initialData={initialProducts} />
        </Suspense>
      </div>
    </PageLayout>
  );
};
