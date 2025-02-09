import { HeroSkeleton } from "@/components/ui/skeletons";
import { getBanners } from "@/lib/hooks/queries/banner/useBanners";
import { Suspense } from "react";
import HeroSliderWrapper from "./HeroSliderWrapper";

export default async function HeroSlider() {
  const slides = await getBanners();
  return (
    <div className="relative overflow-hidden rounded-xl h-[400px] md:h-[500px]">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSliderWrapper slides={slides} />
      </Suspense>
    </div>
  );
}
