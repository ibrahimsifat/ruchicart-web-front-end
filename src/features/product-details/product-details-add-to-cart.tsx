"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/store/cartStore";
import { Product } from "@/types/product";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { CartDrawer } from "../cart/cart-drawer";
import { ProductAddOns } from "./product-addons";
import { ProductVariations } from "./product-variations";

export function ProductDetailsAddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string[]>
  >({});
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  // console.log(product);
  useEffect(() => {
    calculateTotalPrice();
  }, [selectedVariations, selectedAddOns, quantity]);

  const calculateTotalPrice = () => {
    let price = product.price;

    // Add variation prices
    Object.entries(selectedVariations).forEach(
      ([variationName, selectedOptions]) => {
        const variation = product.variations?.find(
          (v) => v.name === variationName
        );
        if (variation) {
          if (Array.isArray(selectedOptions)) {
            selectedOptions.forEach((option) => {
              const optionPrice = variation.values.find(
                (v) => v.label === option
              )?.optionPrice;
              if (optionPrice) price += Number.parseFloat(optionPrice);
            });
          } else {
            const optionPrice = variation.values.find(
              (v) => v.label === selectedOptions
            )?.optionPrice;
            if (optionPrice) price += Number.parseFloat(optionPrice);
          }
        }
      }
    );

    // Add add-on prices
    selectedAddOns.forEach((addOnId) => {
      const addOn = product.add_ons?.find((a) => a.id === addOnId);
      if (addOn) price += addOn.price;
    });

    price *= quantity;
    setTotalPrice(price);

    // Add add-on prices
    selectedAddOns.forEach((addOnId) => {
      const addOn = product.add_ons?.find((a) => a.id === addOnId);
      if (addOn) price += addOn.price;
    });

    price *= quantity;
    setTotalPrice(price);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    const item = {
      id: product.id,
      name: product.name,
      available_time_starts: product.available_time_starts,
      available_time_ends: product.available_time_ends,
      price: totalPrice / quantity,
      image: product.image,
      quantity: quantity,
      variations: selectedVariations,
      variants: [],
      add_ons: selectedAddOns.map(
        (id) => product.add_ons.find((addon) => addon.id === id)!
      ),
    };
    // console.log(item);
    addItem(item);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
    // Open the cart drawer
    setShowCartDrawer(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">${totalPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="text-muted-foreground line-through">
              ${(product.price * quantity).toFixed(2)}
            </span>
          )}
        </div>

        <ProductVariations
          variations={product.variations}
          selectedVariations={selectedVariations}
          setSelectedVariations={setSelectedVariations}
        />
        <ProductAddOns
          addOns={product.add_ons}
          selectedAddOns={selectedAddOns}
          setSelectedAddOns={setSelectedAddOns}
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="lg"
            className="flex-1 lg:px-3"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart - ${totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>
      <CartDrawer open={showCartDrawer} onOpenChange={setShowCartDrawer} />
    </div>
  );
}
