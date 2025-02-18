"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomImage from "@/components/ui/customImage";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import defaultConfig from "@/config/config";
import { ImageType } from "@/types/image";
import { Product } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
import { Expand } from "lucide-react";
import { useState } from "react";

export function ProductGallery({ product }: { product: Product }) {
  const [showLightbox, setShowLightbox] = useState(false);
  return (
    <div className="space-y-6">
      <div className="relative aspect-square rounded-xl overflow-hidden">
        <CustomImage
          type={ImageType.PRODUCT}
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
        {product.discount > 0 && (
          <Badge
            className="absolute top-4 right-4 text-lg"
            variant="destructive"
          >
            {product.discount_type === "percent"
              ? `${product.discount}% OFF`
              : `${defaultConfig.currency_symbol}${product.discount} OFF`}
          </Badge>
        )}

        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4"
          onClick={() => setShowLightbox(true)}
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>
      <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
        <DialogContent className="max-w-5xl p-0">
          <AnimatePresence>
            {showLightbox && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-[4/3] w-full"
              >
                <CustomImage
                  type={ImageType.PRODUCT}
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
