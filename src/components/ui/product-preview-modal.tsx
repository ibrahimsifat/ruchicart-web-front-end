"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { ImageType } from "@/types/image";
import { Eye, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CustomImage from "./customImage";

interface ProductPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    originalPrice?: number;
    addOns?: Array<{
      id: string;
      name: string;
      price: number;
      description?: string;
      image?: string;
    }>;
  };
}

export function ProductPreviewModal({
  open,
  onOpenChange,
  product,
}: ProductPreviewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const { addItem } = useCart();

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotal = () => {
    const basePrice = product.price * quantity;
    const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = product.addOns?.find((a) => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    return basePrice + addOnsTotal;
  };

  const handleAddToCart = () => {
    const selectedAddOnsList = selectedAddOns
      .map((id) => product.addOns?.find((addon) => addon.id === id))
      .filter(Boolean);

    const addOnsCost = selectedAddOnsList.reduce(
      (total, addon) => total + (addon?.price || 0),
      0
    );

    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price + addOnsCost,
      quantity: quantity,
      variation: selectedAddOnsList.length
        ? `With ${selectedAddOnsList.map((a) => a?.name).join(", ")}`
        : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-50 h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="relative h-[200px]">
            <CustomImage
              src={product.image}
              type={ImageType.PRODUCT}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Title & Description */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Starts From:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
            </div>
          </div>

          {/* Add Ons */}
          {product.addOns && product.addOns.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Add Ons</h3>
                <span className="text-sm text-muted-foreground">Optional</span>
              </div>
              <div className="space-y-3">
                {product.addOns.map((addOn) => (
                  <div
                    key={addOn.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border-2 transition-all",
                      selectedAddOns.includes(addOn.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <label className="flex items-center space-x-3 cursor-pointer flex-1">
                      <Checkbox
                        checked={selectedAddOns.includes(addOn.id)}
                        onCheckedChange={() => handleAddOnToggle(addOn.id)}
                      />
                      <div>
                        <p className="font-medium">{addOn.name}</p>
                        {addOn.description && (
                          <p className="text-sm text-muted-foreground">
                            {addOn.description}
                          </p>
                        )}
                      </div>
                    </label>
                    <span className="font-semibold text-primary">
                      +${addOn.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-lg font-semibold transition-colors"
            >
              -
            </button>
            <span className="w-12 text-center text-lg font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center text-lg font-semibold transition-colors"
            >
              +
            </button>
          </div>

          {/* Total & Buttons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Total:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  ${calculateTotal().toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${(product.originalPrice * quantity).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Link href={`/product/${product.id}`} className="flex-1">
                <Button
                  className="w-full bg-primary/10 hover:bg-primary/20 text-primary py-6 text-lg font-semibold"
                  variant="outline"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
