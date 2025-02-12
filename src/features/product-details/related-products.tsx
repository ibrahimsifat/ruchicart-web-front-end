import { getRelatedProducts } from "@/lib/api/services/product.service";
import { RelatedProductsCarousel } from "./related-products-carousel";

export async function RelatedProducts({
  currentProductId,
}: {
  currentProductId: number;
}) {
  const relatedProducts = await getRelatedProducts({
    currentProductId: currentProductId,
  });

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <RelatedProductsCarousel products={relatedProducts} />
    </div>
  );
}
