import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface SearchFiltersProps {
  filters: {
    sortBy: string;
    priceRange: number[];
    categories: string[];
    rating: number;
    discount: boolean;
    isVeg: boolean;
  };
  onFilterChange: (newFilters: Partial<SearchFiltersProps["filters"]>) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
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
            onValueChange={(value) => onFilterChange({ sortBy: value })}
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
            onValueChange={(value) => onFilterChange({ priceRange: value })}
            className="mt-2"
          />
          <div className="flex justify-between mt-2">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        <div>
          <Label>Categories</Label>
          <div className="space-y-2 mt-2">
            {["Pizza", "Burger", "Sushi", "Salad", "Dessert"].map(
              (category) => (
                <div key={category} className="flex items-center">
                  <Checkbox
                    id={category}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...filters.categories, category]
                        : filters.categories.filter((c) => c !== category);
                      onFilterChange({ categories: newCategories });
                    }}
                  />
                  <label
                    htmlFor={category}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="rating">Minimum Rating</Label>
          <Select
            value={filters.rating.toString()}
            onValueChange={(value) =>
              onFilterChange({ rating: Number.parseInt(value) })
            }
          >
            <SelectTrigger id="rating">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating === 0 ? "Any" : `${rating} Stars & Up`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="discount"
            checked={filters.discount}
            onCheckedChange={(checked) => onFilterChange({ discount: checked })}
          />
          <Label htmlFor="discount">Show only discounted items</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="veg"
            checked={filters.isVeg}
            onCheckedChange={(checked) => onFilterChange({ isVeg: checked })}
          />
          <Label htmlFor="veg">Vegetarian only</Label>
        </div>
      </CardContent>
    </Card>
  );
}
