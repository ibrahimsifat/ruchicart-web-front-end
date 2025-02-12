import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { Clock, Leaf, Star } from "lucide-react";
import { Suspense } from "react";
import { ProductDetailsAddToCart } from "./product-details-add-to-cart";

export const ProductDetailsContent = ({ product }: { product: Product }) => {
  return (
    <div className="space-y-4">
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
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <p className="text-muted-foreground">{product.description}</p>
        </TabsContent>
        <TabsContent value="ingredients" className="mt-4">
          {/* Add ingredients content */}
        </TabsContent>
        <TabsContent value="nutrition" className="mt-4">
          {/* Add nutrition content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};
