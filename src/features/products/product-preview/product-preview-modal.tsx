"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Product } from "@/types/product";
import { AnimatePresence } from "framer-motion";
import { memo } from "react";
import {
  ProductDetailsSection,
  ProductGallerySection,
} from "./product-preview-sections";

interface ProductPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export const ProductPreviewModal = memo(
  ({ open, onOpenChange, product }: ProductPreviewModalProps) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-3xl p-0 overflow-hidden"
          aria-describedby="product-preview-modal"
          aria-labelledby="product-preview-modal-title"
        >
          <AnimatePresence mode="wait">
            {open && (
              <div className="grid md:grid-cols-2 gap-8 lg:p-6 p-4">
                <ProductGallerySection product={product} />
                <ProductDetailsSection product={product} />
              </div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  }
);

ProductPreviewModal.displayName = "ProductPreviewModal";
