import { unstable_noStore as noStore } from "next/cache"
import dynamic from "next/dynamic"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/ui/section-header"

const DynamicCarousel = dynamic(() => import("@/components/ui/carousel").then((mod) => mod.Carousel), { ssr: false })
const DynamicCarouselContent = dynamic(() => import("@/components/ui/carousel").then((mod) => mod.CarouselContent), {
  ssr: false,
})
const DynamicCarouselItem = dynamic(() => import("@/components/ui/carousel").then((mod) => mod.CarouselItem), {
  ssr: false,
})
const DynamicCarouselNext = dynamic(() => import("@/components/ui/carousel").then((mod) => mod.CarouselNext), {
  ssr: false,
})
const DynamicCarouselPrevious = dynamic(() => import("@/components/ui/carousel").then((mod) => mod.CarouselPrevious), {
  ssr: false,
})

async function getRestaurants() {
  noStore()
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      id: 1,
      name: "The Gourmet Kitchen",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 234,
      cuisine: "International",
      deliveryTime: "20-30",
      minOrder: 15,
      isPromoted: true,
    },
    {
      id: 2,
      name: "Sushi Master",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 189,
      cuisine: "Japanese",
      deliveryTime: "25-35",
      minOrder: 20,
      isPromoted: true,
    },
    {
      id: 3,
      name: "Spice Paradise",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 156,
      cuisine: "Indian",
      deliveryTime: "30-40",
      minOrder: 18,
      isPromoted: false,
    },
  ]
}

export async function FeaturedRestaurants() {
  const restaurants = await getRestaurants()

  return (
    <section className="py-12">
      <SectionHeader
        title="Featured Restaurants"
        description="Discover the best restaurants in your area"
        action={<Button variant="link">View All</Button>}
      />
      <DynamicCarousel className="w-full">
        <DynamicCarouselContent>
          {restaurants.map((restaurant) => (
            <DynamicCarouselItem key={restaurant.id} className="md:basis-1/2 lg:basis-1/3">
              <Link href={`/restaurant/${restaurant.id}`}>
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48">
                    <Image
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {restaurant.isPromoted && <Badge className="absolute top-4 right-4 bg-primary">Promoted</Badge>}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                        <span className="text-sm text-muted-foreground">({restaurant.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{restaurant.cuisine}</span>
                      <span>•</span>
                      <span>{restaurant.deliveryTime} mins</span>
                      <span>•</span>
                      <span>${restaurant.minOrder} min</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </DynamicCarouselItem>
          ))}
        </DynamicCarouselContent>
        <DynamicCarouselPrevious />
        <DynamicCarouselNext />
      </DynamicCarousel>
    </section>
  )
}

