import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductDetailsImage } from "@/features/product-details/product-details";
import { ProductDetailsContent } from "@/features/product-details/product-details-content";
import { RelatedProducts } from "@/features/product-details/related-products";
import { getProductDetails } from "@/lib/hooks/queries/product/useProducts";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PageLayout from "../../layouts/PageLayout";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductDetails(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found",
    };
  }

  return {
    title: `${product.name} | RuchiCart`,
    description: product.description,
    openGraph: {
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductDetails(id);

  if (!product) {
    notFound();
  }

  return (
    <PageLayout>
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/products`}>products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/products/${product.id}`}>
            {product.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="grid md:grid-cols-2 gap-8">
        <Suspense fallback={<Skeleton className="aspect-square rounded-xl" />}>
          <ProductDetailsImage product={product} />
        </Suspense>
        <div>
          <Suspense fallback={<Skeleton className="h-[400px]" />}>
            <ProductDetailsContent product={product} />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="h-[300px] mt-12" />}>
        <RelatedProducts currentProductId={Number(id)} />
      </Suspense>
    </PageLayout>
  );
}
