import { Card } from "@/components/ui/card";
import Image from "next/image";

export function DiscountBanner() {
  return (
    <Card className="relative overflow-hidden bg-[#E8F9FF] my-10">
      <div className="flex items-center justify-between p-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-orange-600">
            DISCOUNT UPTO 20%
          </h2>
          <p className="text-lg text-muted-foreground">
            for Chinese, Japanese & Asian foods
          </p>
        </div>
        <div className="relative w-48 h-48 hidden md:block">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/Ktljh.png`}
            alt="Asian food"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </Card>
  );
}
