"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearch } from "@/lib/hooks/search/useSearch";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSearch();
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    performSearch();
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  console.log(searchTerm);
  console.log(suggestions);
  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search for restaurant, cuisine or a dish"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-12 pr-12 py-6 text-lg border-2 hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-full shadow-md focus:shadow-lg focus:ring-4 focus:ring-primary/20"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-14 top-1/2 -translate-y-1/2"
            onClick={handleClearSearch}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="absolute top-full left-0 w-full mt-2 p-4 shadow-lg z-50 max-h-[70vh] overflow-y-auto">
              {searchTerm ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
                  {isSuggestionsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : suggestions && suggestions.length > 0 ? (
                    <ul className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="py-2 px-3 hover:bg-accent rounded-lg cursor-pointer transition-colors duration-200"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center">
                            <Search className="h-4 w-4 mr-2  text-primary" />
                            <span>{suggestion}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No suggestions found
                    </p>
                  )}
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
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {recommendedData.categories.map((category) => (
                          <div
                            key={category.id}
                            className="text-center cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => handleSuggestionClick(category.name)}
                          >
                            <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                              <Image
                                src={category.image || "/placeholder.svg"}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <p className="text-sm font-medium">
                              {category.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No categories found
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="cuisines">
                    {isRecommendedLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : recommendedData?.cuisines ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {recommendedData.cuisines.map((cuisine, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                            onClick={() => handleSuggestionClick(cuisine)}
                          >
                            {cuisine}
                          </Button>
                        ))}
                      </div>
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
  );
}
