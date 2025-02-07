"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { Coupon } from "@/lib/api/coupon";
import { formatDateRange, isCouponValid } from "@/lib/utils/date";
import { motion } from "framer-motion";
import { Check, Copy, Tag, Truck } from "lucide-react";
import { useState } from "react";

interface CouponCardProps {
  coupon: Coupon;
  onApply?: (coupon: Coupon) => void;
}

export function CouponCard({ coupon, onApply }: CouponCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const isValid = isCouponValid(coupon.start_date, coupon.expire_date);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast({
        title: "Coupon code copied!",
        description: `${coupon.code} has been copied to your clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the code manually.",
        variant: "destructive",
      });
    }
  };

  const getDiscountText = () => {
    switch (coupon.discount_type) {
      case "percentage":
        return `${coupon.discount}% OFF`;
      case "amount":
        return `$${coupon.discount} OFF`;
      case "free_delivery":
        return "Free Delivery";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="relative h-full overflow-hidden transition-shadow hover:shadow-lg">
        {!isValid && (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-10">
            <Badge variant="destructive" className="text-lg">
              Expired
            </Badge>
          </div>
        )}
        <div className="flex h-full">
          {/* Left Section - Discount Display */}
          <div
            className={`w-1/3 p-6 flex items-center justify-center bg-gradient-to-br ${
              coupon.discount_type === "free_delivery"
                ? "from-green-500 to-green-600"
                : "from-primary to-primary-dark"
            }`}
          >
            <div className="text-center text-white">
              {coupon.discount_type === "free_delivery" ? (
                <Truck className="w-12 h-12 mb-2 mx-auto" />
              ) : (
                <Tag className="w-12 h-12 mb-2 mx-auto" />
              )}
              <h3 className="text-2xl font-bold">{getDiscountText()}</h3>
            </div>
          </div>

          {/* Right Section - Details */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{coupon.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:text-primary/80"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {formatDateRange(coupon.start_date, coupon.expire_date)}
              </p>
              <div className="space-y-1">
                <p className="text-sm">
                  Min. Purchase:{" "}
                  <span className="font-medium">${coupon.min_purchase}</span>
                </p>
                {coupon.max_discount && (
                  <p className="text-sm">
                    Max. Discount:{" "}
                    <span className="font-medium">${coupon.max_discount}</span>
                  </p>
                )}
                {coupon.limit && (
                  <p className="text-sm">
                    Usage Limit:{" "}
                    <span className="font-medium">{coupon.limit} times</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {coupon.code}
              </code>
              {onApply && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onApply(coupon)}
                  disabled={!isValid}
                  className="ml-4"
                >
                  Apply
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
