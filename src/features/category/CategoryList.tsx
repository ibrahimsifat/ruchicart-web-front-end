"use client";

import { useCategories } from "@/lib/hooks/queries/category/useCategories";
import { Category } from "@/types";
import { CategoryCard } from "./CategoryCard";
import { CategorySkeleton } from "./CategorySkeleton";

export function CategoryList() {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (error) {
    console.error(error);
    return <div>Error loading categories</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories?.map((category: Category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
