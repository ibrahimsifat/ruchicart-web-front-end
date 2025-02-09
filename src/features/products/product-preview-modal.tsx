"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomImage from "@/components/ui/customImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/store/cartStore";
import { ImageType } from "@/types/image";
import type { Product } from "@/types/product";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

type ProductPreviewModalProps = {
  product: Product | null;
};
/**

 * Product quick view component
 * Responsibility - Display product information in a dialog format with actions like add to cart, view product details etc.
 *
 * @param product - Product object
 * @returns Product quick view component
 */

export const ProductPreviewModal: FC<ProductPreviewModalProps> = ({
  product,
}) => {
  const router = useRouter();
  if (!product) return null;
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(
    null
  );
  const { addItem } = useCart();
  const { toast } = useToast();

  const discountedPrice =
    product.discount_type === "percent"
      ? product.price - (product.price * product.discount) / 100
      : product.price - product.discount;

  const rating =
    product.rating.length > 0
      ? product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
        product.rating.length
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id.toString(),
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantity,
    });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    // Implement add to wishlist logic here
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };
  const handleClose = () => {
    router.back();
  };

  const handleDetails = () => {
    window.location.reload();
  };
  return (
    <Dialog open={true} defaultOpen={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <div className="relative mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Badge variant="secondary">{product.product_type}</Badge>
              <CustomImage
                type={ImageType.PRODUCT}
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />

              {product.discount > 0 && (
                <Badge variant="destructive" className="absolute right-2 top-2">
                  {product.discount_type === "percent"
                    ? `${product.discount}% OFF`
                    : `$${product.discount} OFF`}
                </Badge>
              )}
            </div>

            <div className="text-left">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {product.name}
                </DialogTitle>
                {product.is_recommended === 1 && (
                  <Badge className="bg-primary w-26">Recommended</Badge>
                )}
              </DialogHeader>
              <p className="mt-2 text-gray-600">
                {product.description?.slice(0, 100)}...
              </p>

              <div className="mt-4 flex items-center space-x-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating)
                          ? "fill-primary text-primary"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating.length} reviews)
                </span>
              </div>

              <div className="mt-4 space-x-2">
                <span className="text-3xl font-bold text-primary">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {product.variations && product.variations.length > 0 && (
                <div className="mt-6">
                  <Label>Select Variation</Label>
                  <RadioGroup
                    value={selectedVariation || ""}
                    onValueChange={setSelectedVariation}
                    className="mt-2"
                  >
                    {product.variations.map((variation) => (
                      <div
                        key={variation.name}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={variation.name}
                          id={variation.name}
                        />
                        <Label htmlFor={variation.name}>{variation.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <div className="mt-6">
                <Label>Quantity</Label>
                <div className="mt-2 flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value) || 1)
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleAddToWishlist}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Add to Wishlist
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleDetails}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* <Separator className="my-8" />

          <div className="mt-8">
            <h3 className="text-xl font-semibold">Related Products</h3>
            <RelatedProducts products={relatedProducts} />
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
ProductPreviewModal.displayName = "ProductPreviewModal";
