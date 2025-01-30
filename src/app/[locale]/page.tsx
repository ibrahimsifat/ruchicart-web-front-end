import { AppDownload } from "@/components/home/app-download";
import { DiscountBanner } from "@/components/home/discount-banner";
import { ExploreCategories } from "@/components/home/explore-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSlider } from "@/components/home/hero-slider";
import { NearbyBranch } from "@/components/home/nearby-branch";
import { TrendingDishes } from "@/components/home/trending-dishes";
import { CategorySkeleton } from "@/features/category/CategorySkeleton";
import { fetchData } from "@/lib/api/fetch-utils";
import { getQueryClient, queryKeys } from "@/lib/api/queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { unstable_noStore as noStore } from "next/cache";
import { Suspense } from "react";
import PageLayout from "./layouts/PageLayout";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "HomePage",
  });

  return {
    title: t("title"), // Localized title for the Home page
    description: t("description"), // Localized description for the Home page
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/home-og-image.jpg", // Home page-specific OpenGraph image
          width: 800,
          height: 600,
          alt: t("title"),
        },
      ],
      url: "https://yourwebsite.com/home", // Home page URL
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/home-twitter-image.jpg"], // Home page-specific Twitter image
    },
  };
}
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
    <PageLayout>
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
    </PageLayout>
  );
}
