"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ProductCard } from "@/features/products/product-card/product-card";
import { api } from "@/lib/api/api";
import { useCart } from "@/store/cartStore";
import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface WishlistItem {
  total_size: number;
  limit: number;
  offset: number;
  products: Product[];
  product_id: number;
}

export default function WishlistPage() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addItem } = useCart();

  const { data, isLoading, error } = useQuery({
    queryKey: ["wishlist", page],
    queryFn: async () => {
      const response = await api.get(
        `/customer/wish-list?limit=10&offset=${page}`
      );
      return response.data;
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: (productId: number) =>
      api.delete("/customer/wish-list/remove", {
        data: { product_id: productId, type: "single" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: "Item removed from wishlist",
        description:
          "The item has been successfully removed from your wishlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch wishlist items. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Wishlist</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data?.products?.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {data.products.map((item: Product) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                exit={{ opacity: 0, y: -20 }}
              >
                <ProductCard product={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-4">
            Start adding items to your wishlist to keep track of products you
            love.
          </p>
          <Link href="/products">
            <Button>Explore Products</Button>
          </Link>
        </div>
      )}
      {data?.total_size > 10 && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="mr-2"
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page * 10 >= data.total_size}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
