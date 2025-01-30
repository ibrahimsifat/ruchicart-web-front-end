import { AppDownload } from "@/components/home/app-download";
import { DiscountBanner } from "@/components/home/discount-banner";
import { ExploreCategories } from "@/components/home/explore-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSlider } from "@/components/home/hero-slider";
import { NearbyBranch } from "@/components/home/nearby-branch";
import { TrendingDishes } from "@/components/home/trending-dishes";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { TopBar } from "@/components/layout/top-bar";
import { CategorySkeleton } from "@/features/category/CategorySkeleton";
import { fetchData } from "@/lib/api/fetch-utils";
import { getQueryClient, queryKeys } from "@/lib/api/queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";

export default async function Home() {
  noStore();
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => fetchData("/categories"),
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.latest,
    queryFn: () => fetchData("/products/latest"),
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.popular,
    queryFn: () => fetchData("/products/popular"),
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.banners.all,
    queryFn: () => fetchData("/banners"),
  });
  await queryClient.prefetchQuery({
    queryKey: queryKeys.branches.all,
    queryFn: () => fetchData("/branch/list"),
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <main>
        <div className="container mx-auto px-4">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<div>Loading featured products...</div>}>
              <HeroSlider />
            </Suspense>
            <Suspense fallback={<CategorySkeleton />}>
              {/* <CategorySection /> */}
              <ExploreCategories />
            </Suspense>
            <Suspense fallback={<div>Loading featured products...</div>}>
              <FeaturedProducts />
            </Suspense>
            <Suspense fallback={<div>Loading trending dishes...</div>}>
              <TrendingDishes />
            </Suspense>
            <Suspense fallback={<div>Loading nearby Branch...</div>}>
              <NearbyBranch />
            </Suspense>
          </HydrationBoundary>
          <DiscountBanner />
          <AppDownload />
        </div>
      </main>
      <Footer />
    </div>
  );
}
