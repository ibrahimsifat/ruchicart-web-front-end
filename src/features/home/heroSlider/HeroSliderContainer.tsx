import { getBanners } from "@/lib/hooks/queries/banner/useBanners";
import { HeroSlider } from "./heroSlider";

export default async function HeroSliderContainer() {
  const slidesPromise = getBanners();
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve([]), 3000); // 3 second timeout
  });

  const slides = (await Promise.race([slidesPromise, timeoutPromise])) as any[];

  return (
    <div className="relative overflow-hidden rounded-b-xl h-[400px] md:h-[500px]">
      <HeroSlider slides={slides || []} />
    </div>
  );
}
