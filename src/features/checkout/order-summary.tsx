"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import CustomImage from "@/components/ui/customImage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CartItem } from "@/store/cart";
import { ImageType } from "@/types/image";
import { Info } from "lucide-react";
import { useState } from "react";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const subtotal = total;
  const discount = 0;
  const vat = subtotal * 0.15; // 15% VAT
  const serviceCharge = 10;
  const deliveryFee = 45;
  const finalTotal = subtotal + vat + serviceCharge + deliveryFee - discount;

  return (
    <Card className="sticky top-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0" />
      <CardHeader className="relative z-10 border-b">
        <CardTitle className="text-2xl font-semibold text-primary">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6 p-6">
        {/* Order Items */}
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
                    <p key={key} className="text-sm text-muted-foreground">
                      {key}: {values.join(", ")}
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

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-red-500">-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span>VAT/TAX (10% Excluded)</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>10% VAT is applied to the subtotal</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span>${vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Charge</span>
            <span>${serviceCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary text-xl">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative z-10 flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-6 border-t">
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm leading-none">
            I agree that placing the order places me under{" "}
            <Button variant="link" className="h-auto p-0">
              Terms and Conditions
            </Button>{" "}
            &{" "}
            <Button variant="link" className="h-auto p-0">
              Privacy Policy
            </Button>
          </label>
        </div>
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
          disabled={!acceptTerms}
        >
          Place Order
        </Button>
      </CardFooter>
    </Card>
  );
}
