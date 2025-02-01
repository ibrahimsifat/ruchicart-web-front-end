"use client";

import { useCategories } from "@/lib/hooks/queries/category/useCategories";
import { Category } from "@/types";
import { CategoryCard } from "./CategoryCard";

export function CategoryList() {
  const { data: categories } = useCategories();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories?.map((category: Category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
