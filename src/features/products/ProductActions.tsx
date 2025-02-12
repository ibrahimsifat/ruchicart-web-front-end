"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/store/cartStore";
import { Product } from "@/types/product";
import { Clock, ShoppingCart } from "lucide-react";
import { useState } from "react";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string[]>
  >({});
  const { addItem } = useCart();

  const handleVariationChange = (
    variationName: string,
    value: string,
    type: string
  ) => {
    if (type === "single") {
      setSelectedVariations((prev) => ({ ...prev, [variationName]: [value] }));
    } else if (type === "multi") {
      setSelectedVariations((prev) => {
        const currentValues = prev[variationName] || [];
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [variationName]: currentValues.filter((v) => v !== value),
          };
        } else {
          return { ...prev, [variationName]: [...currentValues, value] };
        }
      });
    }
  };

  const calculateTotalPrice = () => {
    let total = product.price;
    Object.entries(selectedVariations).forEach(
      ([variationName, selectedValues]) => {
        const variation = product.variations.find(
          (v) => v.name === variationName
        );
        if (variation) {
          selectedValues.forEach((value) => {
            const option = variation.values.find((v) => v.label === value);
            if (option) {
              total += Number.parseFloat(option.optionPrice);
            }
          });
        }
      }
    );
    if (product.discount_type === "percent") {
      total -= total * (product.discount / 100);
    } else {
      total -= product.discount;
    }
    return total;
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: calculateTotalPrice(),
      quantity: 1,
      variant: selectedVariations,
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-500">
          Available: {product.available_time_starts} -{" "}
          {product.available_time_ends}
        </span>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold">
          ${calculateTotalPrice().toFixed(2)}
        </span>
        {product.discount > 0 && (
          <span className="text-xl text-gray-500 line-through ml-2">
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>

      {product.variations.map((variation) => (
        <div key={variation.name} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{variation.name}</h3>
          {variation.type === "single" ? (
            <RadioGroup
              onValueChange={(value) =>
                handleVariationChange(variation.name, value, "single")
              }
              value={selectedVariations[variation.name]?.[0] || ""}
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
                    checked={
                      selectedVariations[variation.name]?.includes(
                        option.label
                      ) || false
                    }
                    onCheckedChange={() =>
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

      <Button className="w-full" size="lg" onClick={handleAddToCart}>
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}
