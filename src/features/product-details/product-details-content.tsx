import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { AlertCircle, Clock, Leaf, Star } from "lucide-react";
import { Suspense } from "react";
import { FrequentlyBought } from "./frequently-bought";
import { ProductDetailsAddToCart } from "./product-details-add-to-cart";

export const ProductDetailsContent = async ({
  product,
}: {
  product: Product;
}) => {
  return (
    <div className="space-y-4 bg-white md:p-5 p-3 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <span className="font-medium">{product.rating}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge
          variant={product.product_type === "veg" ? "success" : "default"}
          className="text-sm px-3 py-1"
        >
          <Leaf className="w-4 h-4 mr-2" />
          {product.product_type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
        </Badge>
        <div className="flex items-center text-muted-foreground text-sm">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            Available: {product.available_time_starts} -{" "}
            {product.available_time_ends}
          </span>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <ProductDetailsAddToCart product={product} />
      </Suspense>

      <Tabs defaultValue="description" className="mt-8">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">
            Reviews ({product.rating.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About this dish</h3>
            <p className="text-muted-foreground">{product.description}</p>
            <div>
              <h4 className="font-medium mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {product.category_ids.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    Category {category.id}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">4.5</div>
                <div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {product.rating.length} reviews
                  </p>
                </div>
              </div>
            </div>
            {product.rating.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No reviews yet. Be the first to review this item.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Placeholder reviews */}
                {[1, 2, 3].map((review) => (
                  <Card key={review} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">Customer {review}</div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 4
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Great food! Would order again.
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        2 days ago
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="nutrition" className="mt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Calories", value: "450 kcal" },
                { label: "Protein", value: "25g" },
                { label: "Carbohydrates", value: "48g" },
                { label: "Fat", value: "22g" },
              ].map((item) => (
                <Card key={item.label} className="p-4">
                  <div className="text-sm text-muted-foreground">
                    {item.label}
                  </div>
                  <div className="text-lg font-semibold mt-1">{item.value}</div>
                </Card>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>
                Values are approximate and may vary based on portion size
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Suspense fallback={<Skeleton className="h-[300px]" />}>
        <FrequentlyBought currentProduct={product} />
      </Suspense>
    </div>
  );
};
