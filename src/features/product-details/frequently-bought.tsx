"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import defaultConfig from "@/config/config";
import { useRelatedProducts } from "@/lib/hooks/queries/product/useProducts";
import { cn, getDiscountedPrice } from "@/lib/utils/utils";
import { useCart } from "@/store/cartStore";
import { ImageType } from "@/types/image";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import CustomImage from "../../components/ui/customImage";
import { Product } from "../../types/product";
import { CartDrawer } from "../cart/cart-drawer";

interface FrequentlyBoughtProps {
  currentProduct: Product;
}

const formatPrice = (price: number | string | undefined): string => {
  const numPrice = Number(price || 0);
  return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
};

const calculateDiscountedPrice = (product: Product): number => {
  const rawPrice = getDiscountedPrice({
    price: Number(product.price) || 0,
    discount: Number(product.discount) || 0,
    discount_type: product.discount_type,
  });
  return Number(rawPrice) || 0;
};

export function FrequentlyBought({ currentProduct }: FrequentlyBoughtProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const { data: relatedProducts } = useRelatedProducts(
    Number(currentProduct.id)
  );
  const suggestedProducts = relatedProducts?.slice(0, 2) || [];
  const allProducts = useMemo(
    () => [currentProduct, ...suggestedProducts],
    [currentProduct, suggestedProducts]
  );

  const [selectedProducts, setSelectedProducts] = useState([currentProduct.id]);

  const selectedProductsData = useMemo(
    () =>
      allProducts.filter((product) => selectedProducts.includes(product.id)),
    [allProducts, selectedProducts]
  );

  const totalPrice = useMemo(() => {
    return selectedProductsData.reduce((sum, product) => {
      return sum + calculateDiscountedPrice(product);
    }, 0);
  }, [selectedProductsData]);

  const handleProductToggle = useCallback((productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const handleAddToCart = useCallback(() => {
    selectedProductsData.forEach((product) => {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: calculateDiscountedPrice(product),
        image: product.image,
        quantity: 1,
        available_time_starts: product.available_time_starts,
        available_time_ends: product.available_time_ends,
      };
      console.log("cartItem", cartItem);
      addItem(cartItem);
    });
    // Open the cart drawer
    setShowCartDrawer(true);
    toast({
      title: "Added to cart",
      description: `${selectedProductsData.length} items added to your cart.`,
    });
  }, [selectedProductsData, addItem, toast]);

  const renderProduct = useCallback(
    (product: Product, index: number) => {
      const isSelected = selectedProducts.includes(product.id);
      const isCurrentProduct = product.id === currentProduct.id;
      const discountedPrice = calculateDiscountedPrice(product);

      return (
        <div key={product.id} className="flex items-center">
          <div className="flex-shrink-0">
            <div className="relative w-24 aspect-square mb-2">
              <CustomImage
                src={product.image}
                type={ImageType.PRODUCT}
                alt={product.name}
                fill
                className={cn(
                  "object-cover rounded-lg transition-opacity",
                  !isSelected && "opacity-50"
                )}
              />
            </div>
            <Checkbox
              defaultChecked={isCurrentProduct}
              icon={<Plus className="h-4 w-4" />}
              checked={isSelected}
              onCheckedChange={() => handleProductToggle(product.id)}
              disabled={isCurrentProduct}
              id={`product-${product.id}`}
            />
            <label
              htmlFor={`product-${product.id}`}
              className={cn(
                "text-sm cursor-pointer",
                !isSelected && "text-muted-foreground"
              )}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  {defaultConfig.currency_symbol}
                  {formatPrice(discountedPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    {defaultConfig.currency_symbol}
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </label>
          </div>
          {index < allProducts.length - 1 && (
            <Plus className="flex-shrink-0 h-4 w-4 text-muted-foreground mx-4" />
          )}
        </div>
      );
    },
    [
      selectedProducts,
      currentProduct.id,
      handleProductToggle,
      allProducts.length,
    ]
  );

  return (
    suggestedProducts.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle>Frequently Bought Together</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center overflow-x-auto pb-4">
            {allProducts.map((product, index) => renderProduct(product, index))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              {selectedProductsData.map((product) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span>{product.name}</span>
                  <span>
                    {defaultConfig.currency_symbol}
                    {formatPrice(calculateDiscountedPrice(product))}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total Price</span>
                <div className="text-right">
                  <div className="text-lg">
                    {defaultConfig.currency_symbol}
                    {formatPrice(totalPrice)}
                  </div>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={selectedProductsData.length === 1}
            >
              Buy {selectedProductsData.length} items together for{" "}
              {defaultConfig.currency_symbol}
              {formatPrice(totalPrice)}
            </Button>
          </div>
        </CardContent>
        <CartDrawer open={showCartDrawer} onOpenChange={setShowCartDrawer} />
      </Card>
    )
  );
}
