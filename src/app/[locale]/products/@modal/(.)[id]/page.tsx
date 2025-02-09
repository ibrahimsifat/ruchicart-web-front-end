import { ProductPreviewModal } from "@/features/products/product-preview-modal";
import { getProductDetails } from "@/lib/hooks/queries/product/useProducts";

import { FC } from "react";

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const ProductDetailsModal: FC<ProductDetailsPageProps> = async ({ params }) => {
  const { id } = await params;
  const product = await getProductDetails(id);

  return <ProductPreviewModal product={product} />;
};

export default ProductDetailsModal;
