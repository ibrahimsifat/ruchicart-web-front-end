import { CategorySkeleton } from "@/components/ui/skeletons";
import { CategoryList } from "@/features/category/CategoryList";
import { fetchData } from "@/lib/api/fetch-utils";
import { getQueryClient, queryKeys } from "@/lib/api/queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
export default async function CategoriesPage() {
  const queryClient = getQueryClient();

  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => fetchData("/categories"),
  });
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Categories</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryList />
        </Suspense>
      </HydrationBoundary>
    </main>
  );
}
