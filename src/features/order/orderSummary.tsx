"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONSTANT } from "@/config/constants";
import type { CartItem } from "@/store/cartStore";
import { ImageType } from "@/types/image";
import { Info } from "lucide-react";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  deliveryTip: number;
  isCashOnDelivery: boolean;
}

export function OrderSummary({
  items,
  total,
  deliveryTip,
  isCashOnDelivery,
}: OrderSummaryProps) {
  const subtotal = total;
  const discount = 0;
  const vat = subtotal * 0.15; // 15% VAT
  const serviceCharge = 10;
  const deliveryFee = 45;
  const cashOnDeliveryFee = CONSTANT.cashOnDeliveryChangeAmount;
  const finalTotal =
    subtotal +
    vat +
    serviceCharge +
    deliveryFee +
    deliveryTip -
    discount +
    (isCashOnDelivery ? cashOnDeliveryFee : 0);

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
                      {key}: {values?.join(", ")}
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
          {deliveryTip > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Delivery Tip</span>
              <span>${deliveryTip.toFixed(2)}</span>
            </div>
          )}
          {isCashOnDelivery && (
            <div className="flex justify-between text-red-500">
              <span>Additional Amount (Cash on Delivery)</span>
              <span>${cashOnDeliveryFee.toFixed(2)}</span>
            </div>
          )}
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
    </Card>
  );
}
