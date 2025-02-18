"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import defaultConfig from "@/config/config";
import { cn } from "@/lib/utils/utils";
import { Variation, VariationValue } from "@/types/product";

interface ProductVariationsProps {
  variations: Variation[];
  selectedVariations: Record<string, string[]>;
  setSelectedVariations: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
}

export function ProductVariations({
  variations,
  selectedVariations,
  setSelectedVariations,
}: ProductVariationsProps) {
  const handleVariationChange = (
    variationName: string,
    value: string,
    type: string
  ) => {
    setSelectedVariations((prev) => ({
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
    <div className="space-y-4">
      {variations.length > 0 && (
        <>
          <h3 className="font-semibold text-lg">Available Variations</h3>
          {variations.map((variation) => (
            <div key={variation.name} className="space-y-2">
              <h4 className="font-medium">
                {variation.name}
                {variation.required === "on" && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h4>
              {variation.type === "single" ? (
                <RadioGroup
                  onValueChange={(value) =>
                    handleVariationChange(variation.name, value, variation.type)
                  }
                  value={selectedVariations[variation.name]?.[0] || ""}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {variation.values.map((option: VariationValue) => (
                      <label
                        key={option.label}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all",
                          (
                            selectedVariations[variation.name] as string[]
                          )?.includes(option.label)
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem
                            value={option.label}
                            id={`${variation.name}-${option.label}`}
                          />
                          <span>{option.label}</span>
                        </div>
                        {Number(option.optionPrice) > 0 && (
                          <span className="text-sm font-medium">
                            +{defaultConfig.currency_symbol}
                            {option.optionPrice}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {variation.values.map((option: VariationValue) => (
                    <label
                      key={option.label}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all",
                        (
                          selectedVariations[variation.name] as string[]
                        )?.includes(option.label)
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={(
                            selectedVariations[variation.name] as string[]
                          )?.includes(option.label)}
                          onCheckedChange={(checked) =>
                            handleVariationChange(
                              variation.name,
                              option.label,
                              variation.type
                            )
                          }
                          id={`${variation.name}-${option.label}`}
                        />
                        <span>{option.label}</span>
                      </div>
                      {Number(option.optionPrice) > 0 && (
                        <span className="text-sm font-medium">
                          +{defaultConfig.currency_symbol}
                          {option.optionPrice}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
