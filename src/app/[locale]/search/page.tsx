"use client";

import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/features/search/searchFilters";
import { SearchResults } from "@/features/search/searchResults";
import { ArrowUpDown } from "lucide-react";

import { Footer } from "@/features/layout/footer";
import { Navbar } from "@/features/layout/navbar";
import { TopBar } from "@/features/layout/topBar";
import { CategoryBannerSlider } from "@/features/search/categoryBannerSlider";
import {
  useCategories,
  useCuisines,
} from "@/lib/hooks/queries/category/useCategories";
import { useSearchStore } from "@/store/searchStore";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { filters, setFilters } = useSearchStore();
  //   const [isLoading, setIsLoading] = useState(true);
  const { data: categories } = useCategories();
  const { data: cuisines } = useCuisines();

  const handleSortChange = (sortBy) => {
    setFilters({ ...filters, sortBy });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <CategoryBannerSlider categories={categories?.slice(0, 3) || []} />
        <h1 className="text-3xl font-bold my-6">
          Search Results for "{searchQuery}"
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Section (client component)*/}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-4">
              <SearchFilters
                categories={categories || []}
                cuisines={cuisines || []}
              />
            </div>
          </div>

          {/* Main Content (server component)*/}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleSortChange(filters.sortBy === "asc" ? "desc" : "asc")
                }
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort {filters.sortBy === "asc" ? "Descending" : "Ascending"}
              </Button>
            </div>

            <SearchResults searchQuery={searchQuery} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
