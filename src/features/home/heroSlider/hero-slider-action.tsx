"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductPreviewModal } from "@/features/products/product-preview-modal";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

function HeroSliderAction({ product }: { product: Product }) {
  const [showPreview, setShowPreview] = useState(false);
  // console.log(product);
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="default"
              variant="default"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:bg-primary transition-colors"
              onClick={() => setShowPreview(true)}
            >
              Order Now
              <ShoppingBag className="h-4 w-4 ml-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to cart</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Product Preview Modal */}
      <ProductPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        product={product}
      />
    </div>
  );
}

export default HeroSliderAction;
