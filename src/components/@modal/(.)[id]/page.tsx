import ProductQuickView from "@/features/products/product-preview-modal";
import { FC, Suspense } from "react";

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const ModalPage: FC<ProductDetailsPageProps> = async ({ params }) => {
  return (
    <Suspense fallback={<div>Loading modal content...</div>}>
      <ProductQuickView params={params} />
    </Suspense>
  );
};

export default ModalPage;
