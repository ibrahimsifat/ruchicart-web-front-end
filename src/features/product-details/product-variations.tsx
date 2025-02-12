"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Variation } from "@/types/product";

export function ProductVariations({
  variations,
  selectedVariations,
  setSelectedVariations,
}: {
  variations: Variation[];
  selectedVariations: Record<string, string[]>;
  setSelectedVariations: (variations: Record<string, string[]>) => void;
}) {
  const handleVariationChange = (
    variationName: string,
    value: string,
    type: string
  ) => {
    setSelectedVariations((prev: Record<string, string[]>) => ({
      ...prev,
      [variationName]:
        type === "single"
          ? [value]
          : prev[variationName]?.includes(value)
          ? prev[variationName].filter((v) => v !== value)
          : [...(prev[variationName] || []), value],
    }));
  };

  return (
    <div className="space-y-6">
      {variations.map((variation) => (
        <div key={variation.name} className="space-y-2">
          <h3 className="font-semibold">{variation.name}</h3>
          {variation.type === "single" ? (
            <RadioGroup
              onValueChange={(value) =>
                handleVariationChange(variation.name, value, "single")
              }
              value={selectedVariations[variation.name]?.join(",")}
            >
              {variation.values.map((option) => (
                <div key={option.label} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.label}
                    id={`${variation.name}-${option.label}`}
                  />
                  <Label htmlFor={`${variation.name}-${option.label}`}>
                    {option.label} (+${option.optionPrice})
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              {variation.values.map((option) => (
                <div key={option.label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${variation.name}-${option.label}`}
                    checked={selectedVariations[variation.name]?.includes(
                      option.label
                    )}
                    onCheckedChange={(checked) =>
                      handleVariationChange(
                        variation.name,
                        option.label,
                        "multi"
                      )
                    }
                  />
                  <Label htmlFor={`${variation.name}-${option.label}`}>
                    {option.label} (+${option.optionPrice})
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
