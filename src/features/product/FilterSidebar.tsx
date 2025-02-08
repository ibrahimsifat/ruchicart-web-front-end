"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilters } from "./useFilters";

/**
 * Filter sidebar component
 * Responsibility - Display filter options for products
 * @returns Filter sidebar component
 */

export const FilterSidebar = () => {
  const { searchParams, updateFilters, router, pathname } = useFilters();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Brands</h3>
        <div className="space-y-2">
          <Checkbox
            id="brand"
            checked={searchParams.getAll("brand").includes("brand")}
            onCheckedChange={() => updateFilters("brand", "brand")}
          />
          <Label htmlFor="brand">Brand</Label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="space-y-2">
          <Checkbox
            id="price"
            checked={searchParams.getAll("price").includes("price")}
            onCheckedChange={() => updateFilters("price", "price")}
          />
          <Label htmlFor="price">Price</Label>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={() => router.push(pathname)}
        variant="outline"
      >
        Clear Filters
      </Button>
    </div>
  );
};

FilterSidebar.displayName = "FilterSidebar";
