"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Product } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
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

const MotionDialogContent = motion(DialogContent);

export const ProductPreviewModal = memo(
  ({ open, onOpenChange, product }: ProductPreviewModalProps) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <MotionDialogContent
          className="max-w-3xl p-0 overflow-hidden"
          aria-describedby="product-preview-modal"
          aria-labelledby="product-preview-modal-title"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {open && (
              <div className="grid md:grid-cols-2 gap-8 lg:p-6 p-4">
                <ProductGallerySection product={product} />
                <ProductDetailsSection product={product} />
              </div>
            )}
          </AnimatePresence>
        </MotionDialogContent>
      </Dialog>
    );
  }
);

ProductPreviewModal.displayName = "ProductPreviewModal";
