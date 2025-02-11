import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { Separator } from "@/components/ui/separator";
import ProductActions from "@/features/product-details/ProductActions";
import { getProductDetails } from "@/lib/hooks/queries/product/useProducts";
import { ImageType } from "@/types/image";
import { Star } from "lucide-react";
import { Suspense } from "react";
import PageLayout from "../../layouts/PageLayout";

type ProductDetailsPageProps = {
  params: { id: string };
};

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProductDetails(id);
  const averageRating =
    product.rating.length > 0
      ? (
          product.rating.reduce((acc, curr) => acc + curr, 0) /
          product.rating.length
        ).toFixed(1)
      : "N/A";

  return (
    <PageLayout>
      <div className="mx-auto py-8">
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative aspect-square">
                <CustomImage
                  type={ImageType.PRODUCT}
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant={
                    product.product_type === "veg" ? "success" : "default"
                  }
                >
                  {product.product_type}
                </Badge>
                {product.is_recommended === 1 && (
                  <Badge variant="secondary">Recommended</Badge>
                )}
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{averageRating}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <Separator className="my-6" />

              <ProductActions product={product} />
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
