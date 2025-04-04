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
import defaultConfig from "@/config/config";
import { CONSTANT } from "@/config/constants";
import { applyCoupon } from "@/lib/hooks/coupon/useCoupon";
import { useToast } from "@/lib/hooks/use-toast";
import { isProductAvailable } from "@/lib/utils/product-availability";
import { useAuthStore } from "@/store/authStore";
import { useCart, type CartItem } from "@/store/cartStore";
import { Coupon } from "@/types/coupon";
import { ImageType } from "@/types/image";
import { useMutation } from "@tanstack/react-query";
import { Info, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CouponModal } from "../checkout/coupon-modal";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  deliveryTip: number;
  isCashOnDelivery: boolean;
  setFinalTotal: (total: number) => void;
}

export function OrderSummary({
  items,
  total,
  deliveryTip,
  isCashOnDelivery,
  setFinalTotal,
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
  const router = useRouter();
  const { itemCount, removeItem, updateQuantity } = useCart();
  const { token, getGuestId } = useAuthStore();
  const { currency_symbol } = defaultConfig;
  // Check availability of items
  const [unavailableItems, setUnavailableItems] = useState<
    {
      name: string;
      image: string;
    }[]
  >([]);
  console.log(items);

  useEffect(() => {
    if (itemCount === 0) {
      router.push("/");
    }
    const checkAvailability = () => {
      const unavailable = items
        .filter(
          (item) =>
            !isProductAvailable(
              item.available_time_starts || "",
              item.available_time_ends || ""
            )
        )
        .map((item) => ({
          name: item.name,
          image: item.image,
        }));
      setUnavailableItems(unavailable);
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [itemCount, router]);

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
  setFinalTotal(finalTotal);
  const handleCouponSelect = (coupon: Coupon) => {
    if (subtotal < coupon.min_purchase) {
      toast({
        title: "Invalid coupon",
        description: `Minimum purchase amount of ${currency_symbol}${coupon.min_purchase} required`,
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
        <CardTitle className="text-2xl font-semibold text-primary-text">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6 p-6">
        {/* Coupon Section */}
        <div className="space-y-2">
          {selectedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary-text" />
                <div>
                  <p className="font-medium">{selectedCoupon.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCoupon.discount_type === "percent"
                      ? `${selectedCoupon.discount}% off`
                      : `${currency_symbol}${selectedCoupon.discount} off`}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm font-medium text-primary-text">
                  -{currency_symbol}
                  {discount.toFixed(2)}
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
          {/* {unavailableItems.length > 0 && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <h3 className="font-bold">Unavailable Items:</h3>
              <ul className="list-disc list-inside">
                {unavailableItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <li>{item.name}</li>
                    <CustomImage
                      type={ImageType.PRODUCT}
                      src={item.image}
                      alt="warning"
                      width={20}
                      height={20}
                    />
                  </div>
                ))}
              </ul>
              <p className="mt-2">
                <span className="font-bold">Note:</span>
                Please remove these items from your cart to proceed with the
                checkout.
              </p>
            </div>
          )} */}
          {items.map((item) => {
            const isUnavailable = unavailableItems.some(
              (unavailableItem) => unavailableItem.name === item.name
            );

            return (
              <div
                key={`${item.id}-${JSON.stringify(item.variations)}`}
                className={`flex gap-4 p-3 rounded-lg ${
                  isUnavailable
                    ? "border-2 border-red-500 bg-red-50"
                    : "border border-primary"
                }`}
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
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{item.name}</h4>
                    {isUnavailable && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7"
                        onClick={() => {
                          // Add removeFromCart
                          removeItem(item.id);
                          toast({
                            title: "Item removed",
                            description:
                              "The unavailable item has been removed from your cart.",
                          });
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  {isUnavailable && (
                    <p className="text-sm text-red-600 font-medium mt-1">
                      This item is currently unavailable
                    </p>
                  )}

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
                      {currency_symbol}
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {currency_symbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-primary-text">
              <span>Discount</span>
              <span>
                -{currency_symbol}
                {discount.toFixed(2)}
              </span>
            </div>
          )}
          {deliveryTip > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Delivery Tip</span>
              <span>
                {currency_symbol}
                {deliveryTip.toFixed(2)}
              </span>
            </div>
          )}
          {isCashOnDelivery && (
            <div className="flex justify-between text-red-500">
              <span>Additional Amount (Cash on Delivery)</span>
              <span>
                {currency_symbol}
                {cashOnDeliveryFee.toFixed(2)}
              </span>
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
            <span>
              {currency_symbol}
              {vat.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Service Charge</span>
            <span>
              {currency_symbol}
              {serviceCharge.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Delivery fee</span>
            <span>
              {currency_symbol}
              {deliveryFee.toFixed(2)}
            </span>
          </div>
          <div className="border-t pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary-text text-xl">
              {currency_symbol}
              {finalTotal.toFixed(2)}
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
