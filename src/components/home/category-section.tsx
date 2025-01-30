import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Pizza", icon: "/placeholder.svg" },
  { name: "Burger", icon: "/placeholder.svg" },
  { name: "Chicken", icon: "/placeholder.svg" },
  { name: "Asian", icon: "/placeholder.svg" },
  { name: "Mexican", icon: "/placeholder.svg" },
  { name: "Dessert", icon: "/placeholder.svg" },
  { name: "Indian", icon: "/placeholder.svg" },
];

export function CategorySection() {
  return (
    <section className="py-8 relative">
      <h2 className="text-2xl font-bold mb-6">What's on Your Mind?</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => (
            <CarouselItem
              key={category.name}
              className="pl-2 md:pl-4 basis-1/4 md:basis-1/7"
            >
              <Link href={`/category/${category.name.toLowerCase()}`}>
                <Card className="p-4 text-center hover:shadow-md transition-shadow">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <Image
                      src={category.icon || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
