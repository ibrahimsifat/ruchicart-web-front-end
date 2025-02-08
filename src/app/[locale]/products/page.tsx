import { FilterSidebar } from "@/features/product/FilterSidebar";
import { ProductsList } from "@/features/product/ProductsList";
import { ProductsSkeleton } from "@/features/product/ProductsSkeleton";
import { Suspense } from "react";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export default function ProductsPage({ searchParams }: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-8">
        <aside className="w-64 flex-shrink-0">
          <Suspense>
            <FilterSidebar />
          </Suspense>
        </aside>

        <div className="flex-1">
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
