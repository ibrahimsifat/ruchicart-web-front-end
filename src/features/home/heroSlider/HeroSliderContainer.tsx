import { HeroSkeleton } from "@/components/ui/skeletons";
import { getBanners } from "@/lib/hooks/queries/banner/useBanners";
import { Suspense } from "react";
import { HeroSlider } from "./heroSlider";

export default async function HeroSliderContainer() {
  // Preload banners data with a short timeout to prevent blocking
  const slidesPromise = getBanners();

  return (
    <Suspense fallback={<HeroSkeleton />}>
      <AsyncHeroSlider slidesPromise={slidesPromise} />
    </Suspense>
  );
}

// AsyncHeroSlider.tsx - Separating data fetching from rendering
async function AsyncHeroSlider({ slidesPromise }) {
  const slides = await slidesPromise;

  return (
    <div className="relative overflow-hidden rounded-b-xl h-[400px] md:h-[500px]">
      <HeroSlider slides={slides} />
    </div>
  );
}
