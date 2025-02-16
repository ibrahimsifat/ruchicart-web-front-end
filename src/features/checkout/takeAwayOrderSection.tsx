"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import CustomImage from "@/components/ui/customImage";
import { Label } from "@/components/ui/label";
import { BaseBranch } from "@/types/branch";
import { ImageType } from "@/types/image";
import { Clock, Coins, Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface TakeAwayOrderSectionProps {
  branch: BaseBranch;
  handleTakeAwaySubmit: () => void;
  isLoading: boolean;
}
const TakeAwayOrderSection = ({
  branch,
  handleTakeAwaySubmit,
  isLoading,
}: TakeAwayOrderSectionProps) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const t = useTranslations("checkout");
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">
        {t("selectedBranch")}{" "}
        <span className="text-primary">{branch?.name}</span>
      </Label>
      <Card key={branch?.id} className="overflow-hidden duration-300">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-2/5 h-48 sm:h-auto">
            <CustomImage
              src={branch?.image || "/placeholder-branch.jpg"}
              alt={branch?.name || ""}
              type={ImageType.BRANCH}
              fill
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{branch?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {branch?.address}
                </p>
              </div>
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={branch?.image} alt={branch?.name} />
                <AvatarFallback>{branch?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <span className="text-sm">{branch?.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-primary" />
                <span className="text-sm">{branch?.email}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-primary" />
                <span className="text-sm">
                  {branch?.preparation_time} {t("minsPrepTime")}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm">
                  {branch?.coverage} {t("kmCoverage")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className="relative z-10 flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-6 border-t">
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm leading-none">
            {t("iAgreeThatPlacingTheOrderPlacesMeUnder")}{" "}
            <Button variant="link" className="h-auto p-0">
              {t("termsAndConditions")}
            </Button>{" "}
            &{" "}
            <Button variant="link" className="h-auto p-0">
              {t("privacyPolicy")}
            </Button>
          </label>
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleTakeAwaySubmit();
          }}
          className="w-full"
          disabled={isLoading || !acceptTerms}
        >
          <Coins className="mr-2 h-4 w-4" />
          {isLoading ? t("processing") : t("confirmTakeAwayOrder")}
        </Button>
      </div>
    </div>
  );
};

export default TakeAwayOrderSection;
