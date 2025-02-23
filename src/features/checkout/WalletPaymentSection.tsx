import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Coins } from "lucide-react";
import { memo } from "react";

export const WalletPaymentSection = memo(
  ({
    acceptTerms,
    setAcceptTerms,
    onSubmit,
    isLoading,
    t,
  }: {
    acceptTerms: boolean;
    setAcceptTerms: (value: boolean) => void;
    onSubmit: () => void;
    isLoading: boolean;
    t: any;
  }) => (
    <>
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
          &
          <Button variant="link" className="h-auto p-0">
            {t("privacyPolicy")}
          </Button>
        </label>
      </div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="w-full"
        disabled={isLoading || !acceptTerms}
      >
        <Coins className="mr-2 h-4 w-4" />
        {isLoading ? t("processing") : t("payWithWallet")}
      </Button>
    </>
  )
);
