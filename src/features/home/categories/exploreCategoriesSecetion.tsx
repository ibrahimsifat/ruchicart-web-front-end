import { ExploreCategories } from "@/features/home/categories/exploreCategories";
import { fetchData } from "@/lib/api/fetchUtils";
import { Category } from "@/types";
import { Suspense } from "react";

export async function getCategories() {
  // "use cache";
  return fetchData<Category[]>("/categories");
}
export default async function ExploreCategoriesSection() {
  const categories = await getCategories();
  console.log(categories, "categories");
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ExploreCategories categories={categories} />
      </Suspense>
    </div>
  );
}
