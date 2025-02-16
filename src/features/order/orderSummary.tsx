"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONSTANT } from "@/config/constants";
import { applyCoupon } from "@/lib/hooks/coupon/useCoupon";
import { useToast } from "@/lib/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import type { CartItem } from "@/store/cartStore";
import { Coupon } from "@/types/coupon";
import { ImageType } from "@/types/image";
import { useMutation } from "@tanstack/react-query";
import { Info, Tag } from "lucide-react";
import { useState } from "react";
import { CouponModal } from "../checkout/coupon-modal";

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
  let discount = 0;
  const vat = subtotal * 0.15; // 15% VAT
  const serviceCharge = 10;
  const deliveryFee = 45;
  const cashOnDeliveryFee = CONSTANT.cashOnDeliveryChangeAmount;
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();
  const { token, getGuestId } = useAuthStore();

  const applyCouponMutation = useMutation({
    mutationFn: (coupon: Coupon) =>
      applyCoupon(coupon.code, !token ? getGuestId() : undefined),
    onSuccess: (data) => {
      setSelectedCoupon(data);
      setShowCouponModal(false);
      toast({
        title: "Coupon applied",
        description: "The coupon has been successfully applied to your order.",
      });
    },
    onError: (error: any) => {
      // console.log(error.response?.data?.errors?.[0]?.message);
      toast({
        title: "Error",
        description:
          error.response?.data?.errors?.[0]?.message ||
          "Failed to apply coupon",
        variant: "destructive",
      });
      setSelectedCoupon(null);
    },
  });

  const calculateDiscount = () => {
    if (!selectedCoupon) return 0;

    if (selectedCoupon.discount_type === "percent") {
      const discount = (subtotal * selectedCoupon.discount) / 100;
      return Math.min(discount, selectedCoupon.max_discount);
    }
    return Math.min(selectedCoupon.discount, selectedCoupon.max_discount);
  };

  discount = calculateDiscount();

  const finalTotal =
    subtotal +
    vat +
    serviceCharge +
    deliveryFee +
    deliveryTip -
    discount +
    (isCashOnDelivery ? cashOnDeliveryFee : 0);

  const handleCouponSelect = (coupon: Coupon) => {
    if (subtotal < coupon.min_purchase) {
      toast({
        title: "Invalid coupon",
        description: `Minimum purchase amount of $${coupon.min_purchase} required`,
        variant: "destructive",
      });
      return;
    }
    applyCouponMutation.mutate(coupon);
  };
  return (
    <Card className="sticky top-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0" />
      <CardHeader className="relative z-10 border-b">
        <CardTitle className="text-2xl font-semibold text-primary">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6 p-6">
        {/* Coupon Section */}
        <div className="space-y-2">
          {selectedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{selectedCoupon.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCoupon.discount_type === "percent"
                      ? `${selectedCoupon.discount}% off`
                      : `$${selectedCoupon.discount} off`}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm font-medium text-primary">
                  -${discount.toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCoupon(null)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => setShowCouponModal(true)}
            >
              <Tag className="h-4 w-4 mr-2" />
              Apply Coupon
            </Button>
          )}
        </div>
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
                      {key}:{" "}
                      {Array.isArray(values) ? values.join(", ") : values}
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
          {discount > 0 && (
            <div className="flex justify-between text-primary">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
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
      <CouponModal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        onSelect={handleCouponSelect}
        selectedCoupon={selectedCoupon}
        orderAmount={subtotal}
      />
    </Card>
  );
}
