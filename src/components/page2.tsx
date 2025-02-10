"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import CustomImage from "@/components/ui/customImage";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cartStore";
import { ImageType } from "@/types/image";
import { Clock, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

interface ProductPageProps {
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    variations: Array<{
      name: string;
      type: string;
      min: string;
      max: string;
      required: string;
      values: Array<{
        label: string;
        optionPrice: string;
      }>;
    }>;
    discount: number;
    discount_type: string;
    available_time_starts: string;
    available_time_ends: string;
    product_type: string;
    is_recommended: number;
    rating: any[];
  };
}

export default function ProductPage({ product }: ProductPageProps) {
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
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative aspect-square">
              <CustomImage
                type={ImageType.PRODUCT}
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant={product.product_type === "veg" ? "success" : "default"}
              >
                {product.product_type}
              </Badge>
              {product.is_recommended === 1 && (
                <Badge variant="secondary">Recommended</Badge>
              )}
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">
                  {product.rating.length > 0
                    ? (
                        product.rating.reduce((acc, curr) => acc + curr, 0) /
                        product.rating.length
                      ).toFixed(1)
                    : "N/A"}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{product.description}</p>
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
            <Separator className="my-6" />
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
                      <div
                        key={option.label}
                        className="flex items-center space-x-2"
                      >
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
                      <div
                        key={option.label}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`${variation.name}-${option.label}`}
                          checked={
                            selectedVariations[variation.name]?.includes(
                              option.label
                            ) || false
                          }
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
            <Button className="w-full" size="lg" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
