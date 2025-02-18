"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";
import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface DeliveryTipsProps {
  value: number;
  onChange: (value: number) => void;
}

const predefinedTips = [
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
  { value: 40, label: "40" },
];

export function DeliveryTips({ value, onChange }: DeliveryTipsProps) {
  const [customTip, setCustomTip] = useState("");
  const t = useTranslations("checkout");
  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setCustomTip(newValue);
      onChange(Number(newValue));
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary-text" />
          {t("deliveryManTips")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="number"
            placeholder={t("enterCustomAmount")}
            value={customTip}
            onChange={handleCustomTipChange}
            className="text-lg"
          />
          <div className="grid grid-cols-4 gap-2">
            {predefinedTips.map((tip) => (
              <Button
                key={tip.value}
                variant="outline"
                className={cn(
                  "h-12 text-lg font-normal transition-all hover:scale-105",
                  value === tip.value &&
                    "border-2 border-primary bg-primary/5 hover:bg-primary/20"
                )}
                onClick={() => {
                  setCustomTip(tip.value.toString());
                  onChange(tip.value);
                }}
              >
                {tip.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
