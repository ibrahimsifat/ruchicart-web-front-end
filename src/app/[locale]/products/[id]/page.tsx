import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { BranchInfo } from "@/features/product-details/branch-info";
import { ProductDetailsContent } from "@/features/product-details/product-details-content";
import { ProductGallery } from "@/features/product-details/product-gallery";
import { PaymentPromotions } from "@/features/product-details/promotion/payment-promotions";
import TrustBadges from "@/features/product-details/promotion/trust-badges";
import { RelatedProducts } from "@/features/product-details/related-products";
import { getProductDetails } from "@/lib/api/services/product.service";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PageLayout from "../../layouts/pageLayout";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProductDetails(id);

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
      <div className="py-6 bg-gray-50 md:p-6 p-4">
        <Breadcrumb name={product.name} />
        <div className="grid lg:grid-cols-[1fr,384px] gap-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Suspense
              fallback={<Skeleton className="aspect-square rounded-xl" />}
            >
              <ProductGallery product={product} />
            </Suspense>
            <div>
              <Suspense fallback={<Skeleton className="h-[400px]" />}>
                <ProductDetailsContent product={product} />
              </Suspense>
            </div>
          </div>
          <div className="space-y-6">
            <Suspense fallback={<Skeleton className="h-[400px]" />}>
              <PaymentPromotions />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[400px]" />}>
              <BranchInfo branchId={product.branch_id} />
            </Suspense>
            {/* Trust Badges */}
            <Suspense fallback={<Skeleton className="h-[400px]" />}>
              <TrustBadges />
            </Suspense>
          </div>
        </div>
        <Suspense fallback={<Skeleton className="h-[300px] mt-12" />}>
          <RelatedProducts currentProductId={Number(id)} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
