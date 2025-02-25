"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CustomImage from "@/components/ui/customImage";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import defaultConfig from "@/config/config";
import { useCart } from "@/store/cartStore";
import { ImageType } from "@/types/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CartCarousel } from "./cart-carousel";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const t = useTranslations("cart");

  const handleCheckout = () => {
    onOpenChange(false);
    router.push(`/checkout`);
  };

  const memoizedItems = useMemo(() => items, [items]);

  const cartItems = useMemo(() => {
    return memoizedItems.map((item) => {
      const itemKey = `${item.id}-${JSON.stringify(
        item.variations
      )}-${JSON.stringify(item.add_ons)}`;
      return (
        <div key={itemKey} className="flex items-center gap-4 pb-4 border-b">
          <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
            <CustomImage
              type={ImageType.PRODUCT}
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex-1">
              <h4 className="font-medium">{item.name}</h4>
              {/* ... (variations and add-ons rendering) */}
              {item.variations &&
                Object.entries(item.variations).map(([key, values]) => (
                  <p key={key} className="text-sm text-muted-foreground">
                    {key}: {Array.isArray(values) ? values.join(", ") : values}
                  </p>
                ))}
              {item.add_ons && item.add_ons.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Add-ons:{" "}
                  <Badge variant="secondary" className="font-medium">
                    {item.add_ons.map((addOn) => addOn.name).join(", ")}
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm">Qty: {item.quantity}</p>
                <p className="font-medium">
                  {defaultConfig.currency_symbol}
                  {(item.price * item.quantity)?.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                {defaultConfig.currency_symbol}
                {item.price}
              </Badge>
              <div className="flex items-center gap-1">
                {/* ... (quantity update and remove buttons) */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    if (item.quantity > 1) {
                      updateQuantity(item.id, item.quantity - 1);
                    } else {
                      removeItem(item.id);
                    }
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    });
  }, [memoizedItems, updateQuantity, removeItem]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        {/* ... (SheetHeader) */}
        <SheetHeader className="space-y-2.5 pb-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span>
              {itemCount} {t("items")}
            </span>
            <span className="text-muted-foreground">{t("inYourCart")}</span>
          </SheetTitle>
        </SheetHeader>

        {memoizedItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems} {/* Render the memoized cart items */}
                <div className="">
                  {/* ... (CartCarousel logic) */}
                  {memoizedItems.length <= 3 && (
                    <div className="mt-6">
                      <CartCarousel productId={memoizedItems[0]?.id} />{" "}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="pt-6 space-y-4">
              {/* ... (Total price and checkout button) */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{t("totalPrice")}</span>
                <span>${total?.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                {t("proceedToCheckout")}
              </Button>
            </div>
          </>
        ) : (
          <div className="">
            {/* ... (Empty cart message) */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              {/* ... */}
              <div className="relative h-32 w-32 text-muted-foreground">
                <ShoppingBag className="h-full w-full stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-lg">{t("yourCartIsEmpty")}</h3>
                <p className="text-muted-foreground">
                  {t("addItemsToYourCartToProceedWithCheckout")}
                </p>
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t("continueShopping")}
              </Button>
            </div>
            <CartCarousel isProductId={false} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
