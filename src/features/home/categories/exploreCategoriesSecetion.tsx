// app/explore-categories/page.tsx
import { ExploreCategories } from "@/features/home/categories/exploreCategories";
import { getCategories } from "@/lib/hooks/queries/category/useCategories";

export default async function ExploreCategoriesSection() {
  const categories = await getCategories();

  return (
    <div>
      <ExploreCategories categories={categories} />
    </div>
  );
}
