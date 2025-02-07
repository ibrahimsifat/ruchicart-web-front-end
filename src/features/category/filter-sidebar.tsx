"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useTranslations } from "next-intl";
import { useState } from "react";

const cuisines = ["Italian", "American", "Japanese", "Mexican", "Indian"];

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const t = useTranslations("category");
  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleFilter = () => {
    // Implement filtering logic here
    console.log("Filtering with:", { priceRange, selectedCuisines });
  };

  return (
    <div className="w-full md:w-64 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">{t("priceRange")}</h3>
        <Slider
          min={0}
          max={50}
          step={1}
          value={priceRange}
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between mt-2">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">{t("cuisine")}</h3>
        {cuisines.map((cuisine) => (
          <div key={cuisine} className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={cuisine}
              checked={selectedCuisines.includes(cuisine)}
              onCheckedChange={() => handleCuisineChange(cuisine)}
            />
            <label
              htmlFor={cuisine}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {cuisine}
            </label>
          </div>
        ))}
      </div>

      <Button onClick={handleFilter} className="w-full">
        {t("applyFilters")}
      </Button>
    </div>
  );
}
