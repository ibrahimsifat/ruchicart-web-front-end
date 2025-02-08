"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { SearchFilters } from "@/features/search/searchFilters";
import { api } from "@/lib/api/api";
import { useLocationStore } from "@/store/locationStore";
import type { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { List, Loader2, Map } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageLayout from "../layouts/PageLayout";

const DynamicProductMap = dynamic(
  () => import("@/features/search/productMap").then((mod) => mod.ProductMap),
  {
    ssr: false,
  }
);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: "relevance",
    priceRange: [0, 1000],
    categories: [],
    rating: 0,
    discount: false,
    isVeg: false,
  });
  const { currentLocation } = useLocationStore();

  const fetchSearchResults = async ({ queryKey }) => {
    const [_, query, pageNum, appliedFilters, location] = queryKey;
    const { data } = await api.post("/products/search", {
      query,
      page: pageNum,
      filters: appliedFilters,
      lat: location?.lat,
      lng: location?.lng,
    });
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", searchQuery, page, filters, currentLocation],
    queryFn: fetchSearchResults,
    enabled: !!searchQuery && !!currentLocation,
  });

  useEffect(() => {
    setPage(1);
  }, [currentLocation, searchQuery]); //Fixed useEffect dependency

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  return (
    <PageLayout>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Search Results for "{searchQuery}"
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
          <div className="w-full md:w-1/4">
            <div className="sticky top-4">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {data?.totalProducts || 0} results found
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>

            {viewMode === "list" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.products?.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="h-[600px] rounded-lg overflow-hidden border">
                <DynamicProductMap
                  products={data?.products || []}
                  currentLocation={currentLocation}
                  zoom={12}
                />
              </div>
            )}

            {data?.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="mr-2"
                >
                  Previous
                </Button>
                <Button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, data.totalPages))
                  }
                  disabled={page === data.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
