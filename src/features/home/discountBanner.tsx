import { CONSTANT } from "@/config/constants";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function DiscountBanner() {
  const t = useTranslations("home");
  return (
    <div className="relative overflow-hidden bg-[#E8F9FF] my-10">
      <div className="flex items-center justify-between ">
        <div className="space-y-2 md:p-8 p-4">
          <h2 className="md:text-4xl text-2xl font-bold text-orange-600">
            {t("discountUpTo20")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("forChineseJapaneseAsianFoods")}
          </p>
        </div>
        <div className="relative w-48 h-48 md:w-64 md:h-64 hidden md:block">
          <Image
            src={CONSTANT.images.prmotional_home_food}
            alt="Asian food"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
