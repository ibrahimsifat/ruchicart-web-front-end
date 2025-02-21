import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product";
import { AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { Suspense } from "react";
import { ProductDetailsAddToCart } from "../product-details/product-details-add-to-cart";
import { ProductGallery } from "../product-details/product-gallery";
import ProductCardAction from "./product-card/product-card-action";

interface ProductPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function ProductPreviewModal({
  open,
  onOpenChange,
  product,
}: ProductPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl p-0 overflow-hidden"
        aria-describedby="product-preview-modal"
        aria-labelledby="product-preview-modal-title"
      >
        <AnimatePresence>
          {open && (
            <div className="grid md:grid-cols-2 gap-8 lg:p-6 p-4">
              <Suspense
                fallback={<Skeleton className="aspect-square rounded-xl" />}
              >
                <ProductGallery product={product} />
              </Suspense>

              <div>
                <div className=" mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <DialogTitle className="text-3xl font-bold">
                      {product.name}
                    </DialogTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">
                        {product.rating.length > 0
                          ? (
                              product.rating.reduce(
                                (acc, curr) => acc + curr,
                                0
                              ) / product.rating.length
                            ).toFixed(1)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {product.description.slice(0, 100)}...
                  </p>
                </div>
                <Suspense fallback={<Skeleton className="h-[400px]" />}>
                  <ProductDetailsAddToCart product={product} />
                </Suspense>
                <div className="mt-3">
                  <Suspense fallback={<Skeleton className="h-[400px]" />}>
                    <ProductCardAction
                      product={product}
                      showAddToCart={false}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
