import { ProductQuickView } from "@/features/product/ProductQuickView";
import { getProductDetails } from "@/lib/hooks/queries/product/useProducts";

import { FC } from "react";

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const ProductDetailsModal: FC<ProductDetailsPageProps> = async ({ params }) => {
  const { id } = await params;
  const product = await getProductDetails(id);

  return <ProductQuickView product={product} />;
};

export default ProductDetailsModal;
