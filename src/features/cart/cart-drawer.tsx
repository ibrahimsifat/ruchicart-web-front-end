"use client";
import { Button } from "@/components/ui/button";
import CustomImage from "@/components/ui/customImage";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/store/cart";
import { ImageType } from "@/types/image";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  const handleCheckout = () => {
    onOpenChange(false);
    router.push(`/checkout`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pb-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span>{itemCount} Items</span>
            <span className="text-muted-foreground">in your cart</span>
          </SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${JSON.stringify(item.variations)}`}
                    className="flex gap-4"
                  >
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                      <CustomImage
                        type={ImageType.PRODUCT}
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.variations &&
                        Object.entries(item.variations).map(([key, values]) => (
                          <p
                            key={key}
                            className="text-sm text-muted-foreground"
                          >
                            {key}:{" "}
                            {Array.isArray(values) ? values.join(", ") : values}
                          </p>
                        ))}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm">Qty: {item.quantity}</p>
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total Price</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed To Checkout
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative h-32 w-32 text-muted-foreground">
              <ShoppingBag className="h-full w-full stroke-1" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-lg">Your cart is empty</h3>
              <p className="text-muted-foreground">
                Add items to your cart to proceed with checkout
              </p>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
