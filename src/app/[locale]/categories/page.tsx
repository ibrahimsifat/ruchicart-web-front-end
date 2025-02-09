import { CategorySkeleton } from "@/components/ui/skeletons";
import { CategoryList } from "@/features/category/CategoryList";
import { fetchData } from "@/lib/api/fetchUtils";
import { getQueryClient, queryKeys } from "@/lib/api/queries";
import { Suspense } from "react";
import PageLayout from "../layouts/PageLayout";
export default async function CategoriesPage() {
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => fetchData("/categories"),
  });
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
