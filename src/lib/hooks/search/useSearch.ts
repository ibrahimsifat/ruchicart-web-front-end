"use client";

import { api } from "@/lib/api/api";
import { fetchRecommendedData } from "@/lib/api/products";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchSuggestions = async (term: string): Promise<string[]> => {
    const { data } = await api.get("/products/search-suggestion", {
      params: { name: term },
    });
    return data;
  };

  const { data: suggestions, isLoading: isSuggestionsLoading } = useQuery({
    queryKey: ["searchSuggestions", debouncedSearchTerm],
    queryFn: () => fetchSuggestions(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: recommendedData, isLoading: isRecommendedLoading } = useQuery({
    queryKey: ["searchRecommended"],
    queryFn: fetchRecommendedData,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const performSearch = useCallback(async () => {
    if (searchTerm.length > 0) {
      // This function is now just a placeholder for any additional logic
      // you might want to perform before navigating to the search results page
      console.log("Performing search for:", searchTerm);
    }
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    handleSearch,
    performSearch,
    suggestions,
    isSuggestionsLoading,
    recommendedData,
    isRecommendedLoading,
  };
}
