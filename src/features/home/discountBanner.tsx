import { Card } from "@/components/ui/card";
import { CONSTANT } from "@/config/constants";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function DiscountBanner() {
  const t = useTranslations("home");
  return (
    <Card className="relative overflow-hidden bg-[#E8F9FF] my-10">
      <div className="flex items-center justify-between p-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-orange-600">
            {t("discountUpTo20")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("forChineseJapaneseAsianFoods")}
          </p>
        </div>
        <div className="relative w-48 h-48 hidden md:block">
          <Image
            src={CONSTANT.images.prmotional_home_food}
            alt="Asian food"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </Card>
  );
}
