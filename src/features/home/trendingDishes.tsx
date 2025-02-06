"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { CartIconRef } from "@/features/layout/navbar";
import { usePopularProducts } from "@/lib/hooks/queries/product/useProducts";
import { Product } from "@/types/product";

const dishes = [
  {
    id: "1",
    name: "Supreme Pizza",
    restaurant: "Pizza Hub",
    price: 19.99,
    image: "/placeholder.svg",
    rating: 4.8,
    deliveryTime: "20-30",
    isNew: true,
  },
  {
    id: "2",
    name: "Chicken Biryani",
    restaurant: "Spice Garden",
    price: 15.99,
    image: "/placeholder.svg",
    rating: 4.6,
    deliveryTime: "25-35",
    discount: 10,
  },
  {
    id: "3",
    name: "Sushi Platter",
    restaurant: "Sushi Master",
    price: 24.99,
    image: "/placeholder.svg",
    rating: 4.9,
    deliveryTime: "30-40",
  },
  {
    id: "4",
    name: "Beef Burger",
    restaurant: "Burger House",
    price: 12.99,
    image: "/placeholder.svg",
    rating: 4.7,
    deliveryTime: "15-25",
    isNew: true,
  },
  {
    id: "5",
    name: "Pasta Carbonara",
    restaurant: "Italian Corner",
    price: 16.99,
    image: "/placeholder.svg",
    rating: 4.5,
    deliveryTime: "20-30",
  },
];

export function TrendingDishes() {
  const { data: productsData, isLoading, error } = usePopularProducts();
  const products = productsData?.products;
  return (
    <CartIconRef.Provider value={null}>
      <section className="py-12">
        <SectionHeader
          title="Trending Now 🔥"
          description="Most ordered dishes near you"
          action={<Button variant="link">View All</Button>}
        />
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {products?.map((product: Product) => (
              <CarouselItem
                key={product.id}
                className="md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={product as Product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </CartIconRef.Provider>
  );
}
