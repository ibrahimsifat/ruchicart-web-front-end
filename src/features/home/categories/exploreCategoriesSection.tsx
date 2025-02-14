import { ExploreCategories } from "@/features/home/categories/exploreCategories";
import { fetcher } from "@/lib/api/services/api.service";
import { Category } from "@/types";
import { Suspense } from "react";

export async function getCategories() {
  return fetcher<Category[]>("/categories");
}
export default async function ExploreCategoriesSection() {
  const categories = await getCategories();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ExploreCategories categories={categories} />
      </Suspense>
    </div>
  );
}
