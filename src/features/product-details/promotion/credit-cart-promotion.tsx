import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CONSTANT } from "@/config/constants";
import Image from "next/image";
const CreditCartPromotion = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-24 bg-[#FFD700]">
          <Image
            src={CONSTANT.images.logo}
            alt="Credit Card Promotion"
            fill
            className="object-cover opacity-5"
          />
          <div className="absolute inset-0 p-4 flex items-center justify-between">
            <div className="space-y-1">
              <Badge variant="secondary" className="bg-white/90">
                Limited Time
              </Badge>
              <h3 className="font-bold text-lg">Extra 15% OFF</h3>
              <p className="text-sm">With Food Club Credit Card</p>
            </div>
            <Image
              src={CONSTANT.images.bankBankLogo}
              alt="Bank Logo"
              width={80}
              height={30}
              className="rounded"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditCartPromotion;
