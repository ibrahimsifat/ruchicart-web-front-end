"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCuisines } from "@/lib/hooks/queries/category/useCategories";
import { useSearch } from "@/lib/hooks/queries/search/useSearch";
import { debounce } from "@/lib/hooks/useDebounce";
import { Category } from "@/types";
import { Cuisine } from "@/types/cuisine";
import { ImageType } from "@/types/image";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Separate animation variants
const cardVariants = {
  hidden: { y: 20, scale: 0.95, opacity: 0 },
  visible: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
  exit: {
    y: -10,
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// Separate components for better code splitting
const SearchSuggestions = React.memo(
  ({
    suggestions,
    isSuggestionsLoading,
    onSuggestionClick,
  }: {
    suggestions: string[];
    isSuggestionsLoading: boolean;
    onSuggestionClick: (suggestion: string) => void;
  }) => {
    if (isSuggestionsLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    if (!suggestions?.length) {
      return (
        <p className="text-muted-foreground text-center py-4">
          No suggestions found
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="py-2 px-3 hover:bg-accent rounded-lg cursor-pointer transition-colors duration-200 list-none"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2 text-primary" />
              <span>{suggestion}</span>
            </div>
          </li>
        ))}
      </div>
    );
  }
);

const CategoryGrid = React.memo(
  ({
    categories,
    onCategoryClick,
  }: {
    categories: Cuisine[] | Category[];
    onCategoryClick: (categoryId: number) => void;
  }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="text-center cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={() => onCategoryClick(category.id || 0)}
        >
          <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
            <CustomImage
              type={ImageType.CATEGORY}
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-sm font-medium">{category.name}</p>
        </div>
      ))}
    </div>
  )
);

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {
    searchTerm,
    setSearchTerm,
    handleSearch,
    performSearch,
    suggestions,
    isSuggestionsLoading,
    recommendedData,
    isRecommendedLoading,
  } = useSearch();

  const { data: cuisines } = useCuisines();

  // Memoized handlers
  const debouncedHandleSearch = useMemo(
    () => debounce((value: string) => handleSearch(value), 300),
    [handleSearch]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchRef.current &&
      event.target instanceof Node &&
      !searchRef.current.contains(event.target)
    ) {
      setIsOpen(false);
      setIsFocused(false);
    }
  }, []);
  // handle esc key
  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        setIsOpen(false);
        setIsFocused(false);
      }
    },
    [isOpen]
  );

  const handleCuisineSuggestionClick = (cuisineId: number) => {
    if (cuisineId) {
      performSearch();
      router.push(`/products?cuisine_id=${cuisineId}`);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      debouncedHandleSearch.cancel();
    };
  }, [handleClickOutside, handleEscKey, debouncedHandleSearch]);

  const navigateToSearchResults = useCallback(
    (term: string) => {
      if (term.trim()) {
        performSearch();
        router.push(`/products?name=${encodeURIComponent(term)}`);
        setIsOpen(false);
        setIsFocused(false);
      }
    },
    [performSearch, router]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      navigateToSearchResults(searchTerm);
    },
    [searchTerm, navigateToSearchResults]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setSearchTerm(suggestion);
      navigateToSearchResults(suggestion);
    },
    [setSearchTerm, navigateToSearchResults]
  );

  const handleCategorySuggestionClick = useCallback(
    (categoryId: number) => {
      if (categoryId) {
        performSearch();
        router.push(`/products?category_id=${categoryId}`);
        setIsOpen(false);
        setIsFocused(false);
      }
    },
    [performSearch, router]
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    if (inputRef.current && isOpen) {
      inputRef.current.focus();
    }
  }, [isOpen, setSearchTerm]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      debouncedHandleSearch(e.target.value);
    },
    [setSearchTerm, debouncedHandleSearch]
  );

  return (
    <>
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <div ref={searchRef} className="relative flex-1 max-w-2xl mx-auto z-50">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search for restaurant, cuisine or a dish"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => {
              setIsOpen(true);
              setIsFocused(true);
            }}
            className="pl-12 pr-12 py-5 text-lg border-2 hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-md outline-none"
            aria-label="Search for Biryani, cuisine or a dish"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md w-9 h-9"
          >
            <AnimatePresence mode="popLayout">
              {searchTerm.length > 0 ? (
                <motion.div
                  key="send"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Send className="h-5 w-5 font-bold" />
                </motion.div>
              ) : (
                <motion.div
                  key="search"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="h-5 w-5 font-bold" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </form>

        <AnimatePresence mode="popLayout">
          {isOpen && (
            <motion.div
              key="search-results"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <Card className="absolute top-full left-0 w-full mt-2 p-4 z-50 max-h-[70vh] overflow-y-auto">
                {searchTerm ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
                    <SearchSuggestions
                      suggestions={suggestions || []}
                      isSuggestionsLoading={isSuggestionsLoading}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </div>
                ) : (
                  <Tabs defaultValue="categories">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="categories">Categories</TabsTrigger>
                      <TabsTrigger value="cuisines">Cuisines</TabsTrigger>
                    </TabsList>
                    <TabsContent value="categories">
                      {isRecommendedLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : recommendedData?.categories ? (
                        <CategoryGrid
                          categories={recommendedData.categories as Category[]}
                          onCategoryClick={handleCategorySuggestionClick}
                        />
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No data available
                        </p>
                      )}
                    </TabsContent>
                    <TabsContent value="cuisines">
                      {isRecommendedLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : cuisines ? (
                        <CategoryGrid
                          categories={cuisines as Cuisine[]}
                          onCategoryClick={handleCuisineSuggestionClick}
                        />
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No cuisines found
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
