import {
  BranchCardSkeleton,
  CategorySkeleton,
  HeroSkeleton,
  ProductCardSkeleton,
  PromoCardSkeleton,
} from "@/components/ui/skeletons";
import { NearbyBranch } from "@/features/branch/nearbyBranch";
import { ExploreCategories } from "@/features/home/categories/exploreCategories";
import { DiscountBanner } from "@/features/home/discountBanner";
import { FeaturedProducts } from "@/features/home/featuredProducts";
import HeroSlider from "@/features/home/heroSlider/heroSlider";
import { TrendingDishes } from "@/features/home/trendingDishes";
import { getCategories } from "@/lib/api/services/category.service";
import {
  getFeaturedProducts,
  getTrendingProducts,
} from "@/lib/api/services/product.service";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import PageLayout from "./layouts/PageLayout";

// Separate metadata generation
async function generateMetadata({
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
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/home-og-image.jpg",
          width: 800,
          height: 600,
          alt: t("title"),
        },
      ],
      url: "https://ruchicart.com/",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/home-twitter-image.jpg"],
    },
  };
}

// Main page component
export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const trendingProducts = await getTrendingProducts();
  const categories = await getCategories();
  return (
    <PageLayout>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider />
      </Suspense>
      <Suspense fallback={<CategorySkeleton />}>
        <ExploreCategories categories={categories} />
      </Suspense>
      <Suspense fallback={<ProductCardSkeleton />}>
        <FeaturedProducts featuredProductsData={featuredProducts} />
      </Suspense>
      <Suspense fallback={<PromoCardSkeleton />}>
        <TrendingDishes trendingProductsData={trendingProducts} />
      </Suspense>
      <Suspense fallback={<BranchCardSkeleton />}>
        <NearbyBranch />
      </Suspense>

      {/* Static content renders immediately */}
      <DiscountBanner />
    </PageLayout>
  );
}
