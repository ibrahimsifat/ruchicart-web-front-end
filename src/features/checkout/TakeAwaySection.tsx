import { ShoppingBag } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { BaseBranch } from "@/types/branch";

export const TakeAwaySection = memo(
  ({
    branch,
    onSubmit,
    isLoading,
    t,
  }: {
    branch: BaseBranch;
    onSubmit: () => void;
    isLoading: boolean;
    t: any;
  }) => (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-2">{t("pickupLocation")}</h3>
        <p className="text-sm text-muted-foreground">{branch?.address}</p>
      </div>

      <Button
        onClick={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="w-full"
        disabled={isLoading}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        {isLoading ? t("processing") : t("placeOrder")}
      </Button>
    </div>
  )
);
