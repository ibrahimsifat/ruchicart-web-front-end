"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Add-ons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {addOns.map((addOn) => (
            <Label
              key={addOn.id}
              htmlFor={`addon-${addOn.id}`}
              className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent transition-colors"
            >
              <Checkbox
                id={`addon-${addOn.id}`}
                checked={selectedAddOns.includes(addOn.id)}
                onCheckedChange={() => handleAddOnChange(addOn.id)}
              />
              <span className="flex-1">{addOn.name}</span>
              <span className="text-sm font-semibold">
                +${addOn.price.toFixed(2)}
              </span>
            </Label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
