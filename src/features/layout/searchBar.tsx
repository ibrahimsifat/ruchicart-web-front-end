"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Search, TrendingUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
<style jsx global>{`
  body.search-focused {
    overflow: hidden;
  }
`}</style>;

const recentSearches = [
  "Pizza",
  "Burger King",
  "Chinese Restaurant",
  "Italian Food",
];

const trending = [
  { name: "Spicy Ramen", count: "2.5k searches" },
  { name: "Bubble Tea", count: "1.8k searches" },
  { name: "Korean BBQ", count: "1.2k searches" },
];

const categories = [
  { name: "Restaurants", icon: "🏪" },
  { name: "Breakfast", icon: "🍳" },
  { name: "Chinese", icon: "🥢" },
  { name: "Italian", icon: "🍝" },
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // const [activeTab, setActiveTab] = useState("all");
  const searchRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsOpen(true);
    document.body.classList.add("search-focused");
  };

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
      document.body.classList.remove("search-focused");
    };
  }, []);

  return (
    <div ref={searchRef} className="relative flex-1 max-w-xxl md:mx-10">
      <div className="relative transition-all duration-300 ease-in-out">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-50" />
        <Input
          type="search"
          placeholder="Search for restaurant, cuisine or a dish"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          className="pl-4 pr-12 py-5 text-lg border-2 hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-md relative z-50 bg-background outline-none focus:ring-0 focus:outline-none"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
            onClick={() => setQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-background rounded-xl border shadow-lg z-50 overflow-hidden">
            {/* <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="px-2 pt-2 border-b">
                <TabsList className="w-full h-11">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="restaurants" className="flex-1">
                    Restaurants
                  </TabsTrigger>
                  <TabsTrigger value="dishes" className="flex-1">
                    Dishes
                  </TabsTrigger>
                </TabsList>
              </div> */}

            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-6">
                {!query && (
                  <>
                    {/* Recent Searches */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground px-2">
                        Recent Searches
                      </h3>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start h-auto px-2 py-2 text-base hover:bg-primary/5"
                          >
                            <History className="h-4 w-4 mr-2 text-muted-foreground" />
                            {search}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Trending Searches */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground px-2">
                        Trending Now
                      </h3>
                      <div className="space-y-1">
                        {trending.map((item, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start h-auto px-2 py-2 text-base hover:bg-primary/5"
                          >
                            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                            <span className="flex-1">{item.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {item.count}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground px-2">
                        Popular Categories
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="h-auto py-4 justify-start hover:bg-primary/5 hover:border-primary/50"
                          >
                            <span className="text-2xl mr-2">
                              {category.icon}
                            </span>
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {query && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground px-2">
                      Showing results for "{query}"
                    </p>
                    {/* Add search results here */}
                  </div>
                )}
              </div>
            </ScrollArea>
            {/* </Tabs> */}
          </div>
        </>
      )}
    </div>
  );
}
