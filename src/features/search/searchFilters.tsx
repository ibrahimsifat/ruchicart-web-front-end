"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSearchStore } from "@/store/searchStore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface SearchFiltersProps {
  categories: Array<{ id: number; name: string }>;
  cuisines: Array<{ id: number; name: string }>;
}

export function SearchFilters({ categories, cuisines }: SearchFiltersProps) {
  const { filters, setFilters } = useSearchStore();

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="sort-by">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger id="sort-by">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low-to-high">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-high-to-low">
                Price: High to Low
              </SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Price Range</Label>
          <Slider
            min={0}
            max={1000}
            step={10}
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange("priceRange", value)}
            className="mt-2"
          />
          <div className="flex justify-between mt-2">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        <div>
          <Label>Categories</Label>
          <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    const newCategories = checked
                      ? [...filters.categories, category.id]
                      : filters.categories.filter((c) => c !== category.id);
                    handleFilterChange("categories", newCategories);
                  }}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Cuisines</Label>
          <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
            {cuisines.map((cuisine) => (
              <div key={cuisine.id} className="flex items-center">
                <Checkbox
                  id={`cuisine-${cuisine.id}`}
                  checked={filters.cuisines.includes(cuisine.id)}
                  onCheckedChange={(checked) => {
                    const newCuisines = checked
                      ? [...filters.cuisines, cuisine.id]
                      : filters.cuisines.filter((c) => c !== cuisine.id);
                    handleFilterChange("cuisines", newCuisines);
                  }}
                />
                <label
                  htmlFor={`cuisine-${cuisine.id}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {cuisine.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Minimum Rating</Label>
          <div className="flex items-center space-x-2 mt-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating >= rating ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("rating", rating)}
                className="p-2"
              >
                <Star
                  className={`h-4 w-4 ${
                    filters.rating >= rating ? "fill-yellow-400" : ""
                  }`}
                />
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="discount"
            checked={filters.discount}
            onCheckedChange={(checked) =>
              handleFilterChange("discount", checked)
            }
          />
          <Label htmlFor="discount">Show only discounted items</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="veg"
            checked={filters.isVeg}
            onCheckedChange={(checked) => handleFilterChange("isVeg", checked)}
          />
          <Label htmlFor="veg">Vegetarian only</Label>
        </div>

        <Button
          onClick={() =>
            setFilters({
              sortBy: "relevance",
              priceRange: [0, 1000],
              categories: [],
              cuisines: [],
              rating: 0,
              discount: false,
              isVeg: false,
            })
          }
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
