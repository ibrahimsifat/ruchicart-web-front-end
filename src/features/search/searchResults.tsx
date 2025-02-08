import { ProductCard } from "@/components/ui/product-card";
import { api } from "@/lib/api/api";
import { useSearchStore } from "@/store/searchStore";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useTransition } from "react";

interface SearchResultsProps {
  searchQuery: string;
}

export function SearchResults({ searchQuery }: SearchResultsProps) {
  const { filters } = useSearchStore();
  const [isPending, startTransition] = useTransition();
  console.log(searchQuery);
  const fetchSearchResults = async ({ queryKey }) => {
    const [_, query] = queryKey;
    const { data } = await api.post("/products/search", {
      name: query,
    });
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", searchQuery, filters],
    queryFn: fetchSearchResults,
    enabled: !!searchQuery,
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: Something went wrong</p>;

  const sortedProducts = data?.products.sort((a: Product, b: Product) => {
    if (filters.sortBy === "price-low-to-high") {
      return a.price - b.price;
    } else if (filters.sortBy === "price-high-to-low") {
      return b.price - a.price;
    } else if (filters.sortBy === "rating") {
      return b.rating - a.rating;
    } else if (filters.sortBy === "popularity") {
      return b.popularity_count - a.popularity_count;
    }
    return 0;
  });

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* <div ref={ref} className="flex justify-center mt-8">
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : hasNextPage ? (
            "Load More"
          ) : (
            "No More Results"
          )}
        </Button>
      </div> */}

      {isPending && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground py-2 px-4 rounded-md shadow-lg">
          Updating results...
        </div>
      )}
    </div>
  );
}
