"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductFiltersProps {
  categories: Array<{ id: number; name: string }>;
  cuisines: string[];
  maxPrice: number;
}

export function ProductFilters({
  categories,
  cuisines,
  maxPrice,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [availability, setAvailability] = useState<string>("all");

  // Initialize filters from URL
  useEffect(() => {
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    if (minPrice && maxPrice) {
      setPriceRange([Number.parseInt(minPrice), Number.parseInt(maxPrice)]);
    }

    const rating = searchParams.get("rating");
    if (rating) {
      setSelectedRating(rating);
    }

    const categories = searchParams.get("category_id");
    if (categories) {
      setSelectedCategories(categories.split(","));
    }

    const cuisines = searchParams.get("cuisine_id");
    if (cuisines) {
      setSelectedCuisines(cuisines.split(","));
    }

    const type = searchParams.get("product_type");
    if (type) {
      setSelectedType(type);
    }

    const avail = searchParams.get("availability");
    if (avail) {
      setAvailability(avail);
    }
  }, [searchParams]);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          current.delete(key);
        } else {
          current.set(key, value.toString());
        }
      });

      return current.toString();
    },
    [searchParams]
  );

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    router.push(
      `${pathname}?${createQueryString({
        min_price: value[0],
        max_price: value[1],
      })}`
    );
  };

  const handleRatingChange = (value: string) => {
    setSelectedRating(value === selectedRating ? "" : value);
    router.push(
      `${pathname}?${createQueryString({
        rating: value === selectedRating ? null : value,
      })}`
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updated);
    router.push(
      `${pathname}?${createQueryString({
        category_id: updated.length ? updated.join(",") : null,
      })}`
    );
  };

  const handleCuisineChange = (cuisine: string) => {
    const updated = selectedCuisines.includes(cuisine)
      ? selectedCuisines.filter((c) => c !== cuisine)
      : [...selectedCuisines, cuisine];

    setSelectedCuisines(updated);
    router.push(
      `${pathname}?${createQueryString({
        cuisine_id: updated.length ? updated.join(",") : null,
      })}`
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type === selectedType ? "" : type);
    router.push(
      `${pathname}?${createQueryString({
        product_type: type === selectedType ? null : type,
      })}`
    );
  };

  const handleAvailabilityChange = (value: string) => {
    setAvailability(value);
    router.push(
      `${pathname}?${createQueryString({
        availability: value === "all" ? null : value,
      })}`
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, maxPrice]);
    setSelectedRating("");
    setSelectedCategories([]);
    setSelectedCuisines([]);
    setSelectedType("");
    setAvailability("all");
    router.push(pathname);
  };

  const activeFiltersCount = [
    priceRange[0] > 0 || priceRange[1] < maxPrice,
    selectedRating,
    ...selectedCategories,
    ...selectedCuisines,
    selectedType,
    availability !== "all",
  ].filter(Boolean).length;

  return (
    <aside className="w-full lg:w-[300px]">
      <div className="sticky top-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 text-muted-foreground hover:text-primary"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Active Filters */}
          <AnimatePresence>
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2"
              >
                <Label>Active Filters</Label>
                <div className="flex flex-wrap gap-2">
                  {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                    <Badge variant="secondary">
                      ${priceRange[0]} - ${priceRange[1]}
                      <X
                        className="ml-1 h-3 w-3"
                        onClick={() => handlePriceChange([0, maxPrice])}
                      />
                    </Badge>
                  )}
                  {selectedRating && (
                    <Badge variant="secondary">
                      {selectedRating}+ Stars
                      <X
                        className="ml-1 h-3 w-3"
                        onClick={() => handleRatingChange(selectedRating)}
                      />
                    </Badge>
                  )}
                  {selectedCategories.map((id) => {
                    const category = categories.find(
                      (c) => c.id.toString() === id
                    );
                    return category ? (
                      <Badge key={id} variant="secondary">
                        {category.name}
                        <X
                          className="ml-1 h-3 w-3"
                          onClick={() => handleCategoryChange(id)}
                        />
                      </Badge>
                    ) : null;
                  })}
                  {selectedCuisines.map((cuisine) => (
                    <Badge key={cuisine} variant="secondary">
                      {cuisine}
                      <X
                        className="ml-1 h-3 w-3"
                        onClick={() => handleCuisineChange(cuisine)}
                      />
                    </Badge>
                  ))}
                  {selectedType && (
                    <Badge variant="secondary">
                      {selectedType === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                      <X
                        className="ml-1 h-3 w-3"
                        onClick={() => handleTypeChange(selectedType)}
                      />
                    </Badge>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Price Range */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Price Range
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-4">
                <Slider
                  min={0}
                  max={maxPrice}
                  step={10}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="py-4"
                />
                <div className="flex items-center justify-between">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange([
                        Number.parseInt(e.target.value),
                        priceRange[1],
                      ])
                    }
                    className="w-24"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange([
                        priceRange[0],
                        Number.parseInt(e.target.value),
                      ])
                    }
                    className="w-24"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Rating */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Rating
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRatingChange(rating.toString())}
                    className={`flex w-full items-center rounded-lg px-3 py-2 transition-colors ${
                      selectedRating === rating.toString()
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex flex-1 items-center">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                      {Array.from({ length: 5 - rating }).map((_, i) => (
                        <Star
                          key={i + rating}
                          className="h-4 w-4 text-muted-foreground"
                        />
                      ))}
                      <span className="ml-2">& Up</span>
                    </div>
                    {selectedRating === rating.toString() && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </motion.button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Categories */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Categories
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(
                          category.id.toString()
                        )}
                        onCheckedChange={() =>
                          handleCategoryChange(category.id.toString())
                        }
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>

          {/* Cuisines */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Cuisines
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {cuisines.map((cuisine) => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cuisine-${cuisine}`}
                        checked={selectedCuisines.includes(cuisine)}
                        onCheckedChange={() => handleCuisineChange(cuisine)}
                      />
                      <Label
                        htmlFor={`cuisine-${cuisine}`}
                        className="flex-1 cursor-pointer"
                      >
                        {cuisine}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>

          {/* Product Type */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Product Type
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-2">
                {[
                  { value: "veg", label: "Vegetarian" },
                  { value: "non_veg", label: "Non-Vegetarian" },
                ].map((type) => (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTypeChange(type.value)}
                    className={`flex w-full items-center rounded-lg px-3 py-2 transition-colors ${
                      selectedType === type.value
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <span className="flex-1 text-left">{type.label}</span>
                    {selectedType === type.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </motion.button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Availability */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
              Availability
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-2">
                {[
                  { value: "all", label: "All Items" },
                  { value: "in_stock", label: "In Stock" },
                  { value: "out_of_stock", label: "Out of Stock" },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAvailabilityChange(option.value)}
                    className={`flex w-full items-center rounded-lg px-3 py-2 transition-colors ${
                      availability === option.value
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <span className="flex-1 text-left">{option.label}</span>
                    {availability === option.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </motion.button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </aside>
  );
}
