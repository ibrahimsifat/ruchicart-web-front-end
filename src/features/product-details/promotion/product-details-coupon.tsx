"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useCoupons } from "@/lib/hooks/coupon/useCoupon";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Percent, Tag } from "lucide-react";
import { useState } from "react";

const ProductDetailsCoupon = () => {
  const [showCouponInput, setShowCouponInput] = useState(false);
  const { data: coupons } = useCoupons();
  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-start gap-2 text-primary"
        onClick={() => setShowCouponInput(!showCouponInput)}
      >
        <Tag className="h-4 w-4" />
        <span>Have a coupon code?</span>
      </Button>
      <AnimatePresence>
        {showCouponInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="mt-2 border-primary/20">
              <CardContent className="p-4">
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Percent className="h-4 w-4" />
                    <span>Available Coupons:</span>
                  </div>
                  {coupons?.map((coupon) => (
                    <Button
                      key={coupon.code}
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        toast({
                          title: "Copied to clipboard",
                        });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{coupon.code}</span>
                        <span className="text-sm text-muted-foreground">
                          {coupon.discount_type === "percent"
                            ? `${coupon.discount}% off`
                            : `$${coupon.discount} off`}
                        </span>
                      </div>
                      <Copy className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailsCoupon;
