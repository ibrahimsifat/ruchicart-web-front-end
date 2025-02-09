import { Card } from "@/components/ui/card";
import { BannerItem } from "@/types/banner";
import { ImageType } from "@/types/image";
import CustomImage from "../../../components/ui/customImage";
import HeroSliderAction from "./hero-slider-action";

export default function HeroSliderContent({ slide }: { slide: BannerItem }) {
  return (
    <Card className="w-full h-full bg-blue-100">
      <div className="flex flex-col md:flex-row items-center justify-between h-full p-8 md:p-12">
        <div className="space-y-4 text-center md:text-left max-w-lg">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {slide?.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            {slide?.product.description.slice(0, 100)}...
          </p>

          <HeroSliderAction product={slide.product} />
        </div>
        <div className="relative w-full md:w-1/2 h-48 md:h-full mt-8 md:mt-0">
          <CustomImage
            src={slide.product.image || "/placeholder.svg"}
            alt={slide.title}
            type={ImageType.PRODUCT}
            fill
            className="object-contain opacity-0 transition-opacity duration-500 ease-in-out"
            onLoad={(event) => {
              const img = event.target as HTMLImageElement;
              img.classList.remove("opacity-0");
            }}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </Card>
  );
}
