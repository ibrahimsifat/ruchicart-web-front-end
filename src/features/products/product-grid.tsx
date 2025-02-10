"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchProducts } from "@/lib/api/products";
import type { Product, ProductResponse } from "@/types/product";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "./product-card";

import { Button } from "@/components/ui/button";
import ItemNotFound from "@/components/utils/itemNotFound";
import { AnimatePresence, motion } from "framer-motion";
import { Grid, List } from "lucide-react";
import { ProductListItem } from "./product-list-item";

interface ProductGridProps {
  initialData: ProductResponse;
}

const PRODUCTS_PER_PAGE = 12;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ProductGrid({ initialData }: ProductGridProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialData.total_size > initialData.products.length
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { ref, inView } = useInView();

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const data = await searchProducts({
        ...params,
        limit: PRODUCTS_PER_PAGE,
        offset: products.length,
      });

      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.total_size > products.length + data.products.length);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, products.length, searchParams]);

  useEffect(() => {
    if (inView) {
      loadMoreProducts();
    }
  }, [inView, loadMoreProducts]);

  useEffect(() => {
    setProducts(initialData.products);
    setHasMore(initialData.total_size > initialData.products.length);
  }, [initialData]);

  const handleSortChange = async (value: string) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const data = await searchProducts({
        ...params,
        sort_by: value,
        limit: PRODUCTS_PER_PAGE,
        offset: 0,
      });
      setProducts(data.products);
      setHasMore(data.total_size > data.products.length);
    } catch (error) {
      console.error("Failed to sort products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Showing {products.length} of {initialData.total_size} products
          </p>
        </div>
        <Select
          defaultValue={searchParams.get("sort_by") ?? ""}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new_arrival">New Arrival</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="price_high_to_low">
              Price: High to Low
            </SelectItem>
            <SelectItem value="price_low_to_high">
              Price: Low to High
            </SelectItem>
            <SelectItem value="a_to_z">Name: A to Z</SelectItem>
            <SelectItem value="z_to_a">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {products.length > 0 ? (
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductListItem product={product} isAvailable={true} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <ItemNotFound />
      )}

      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading more products...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
