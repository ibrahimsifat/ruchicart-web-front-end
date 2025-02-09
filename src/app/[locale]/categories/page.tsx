import { CategorySkeleton } from "@/components/ui/skeletons";
import { CategoryList } from "@/features/category/CategoryList";
import { Suspense } from "react";
import PageLayout from "../layouts/PageLayout";
export default async function CategoriesPage() {
  return (
    <PageLayout>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Our Categories</h1>
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryList />
        </Suspense>
      </main>
    </PageLayout>
  );
}
