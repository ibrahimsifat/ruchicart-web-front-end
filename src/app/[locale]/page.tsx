import {
  BranchCardSkeleton,
  CategorySkeleton,
  HeroSkeleton,
  ProductCardSkeleton,
  PromoCardSkeleton,
} from "@/components/ui/skeletons";
import { AppDownload } from "@/features/home/appDownload";
import { NearbyBranch } from "@/features/home/branch/nearbyBranch";
import ExploreCategoriesSection from "@/features/home/categories/exploreCategoriesSecetion";
import { DiscountBanner } from "@/features/home/discountBanner";
import { FeaturedProducts } from "@/features/home/featuredProducts";
import HeroSlider from "@/features/home/heroSlider/heroSlider";
import { TrendingDishes } from "@/features/home/trendingDishes";
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

// Static components that don't need data fetching
function StaticContent() {
  return (
    <>
      <DiscountBanner />
      <AppDownload />
    </>
  );
}

// Main page component
export default function Home() {
  return (
    <PageLayout>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider />
      </Suspense>
      <Suspense fallback={<CategorySkeleton />}>
        <ExploreCategoriesSection />
      </Suspense>
      <Suspense fallback={<ProductCardSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<PromoCardSkeleton />}>
        <TrendingDishes />
      </Suspense>
      <Suspense fallback={<BranchCardSkeleton />}>
        <NearbyBranch />
      </Suspense>
      {/* Static content renders immediately */}
      <StaticContent />
    </PageLayout>
  );
}
