"use client";

import { Checkbox } from "@/components/ui/checkbox";
import defaultConfig from "@/config/config";

import { cn } from "@/lib/utils/utils";
import { AddOn } from "@/types/product";

export function ProductAddOns({
  addOns,
  selectedAddOns,
  setSelectedAddOns,
}: {
  addOns: AddOn[];
  selectedAddOns: number[];
  setSelectedAddOns: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const handleAddOnChange = (addOnId: number) => {
    setSelectedAddOns((prev: number[]) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  if (addOns.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Add-ons</h3>
      <div className="grid grid-cols-2 gap-2">
        {addOns.map((addOn) => (
          <label
            key={addOn.id}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all",
              selectedAddOns.includes(addOn.id)
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedAddOns.includes(addOn.id)}
                onCheckedChange={() => handleAddOnChange(addOn.id)}
                id={`addon-${addOn.id}`}
              />
              <span>{addOn.name}</span>
            </div>
            <span className="text-sm font-medium">
              +{defaultConfig.currency_symbol}
              {addOn.price.toFixed(2)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
