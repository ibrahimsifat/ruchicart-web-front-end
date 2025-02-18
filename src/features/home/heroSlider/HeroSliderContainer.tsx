import { getBanners } from "@/lib/hooks/queries/banner/useBanners";
import { HeroSlider } from "./heroSlider";

export default async function HeroSliderContainer() {
  const slides = await getBanners();

  return (
    <div className="relative overflow-hidden rounded-xl h-[400px] md:h-[500px]">
      <HeroSlider slides={slides} />
    </div>
  );
}
