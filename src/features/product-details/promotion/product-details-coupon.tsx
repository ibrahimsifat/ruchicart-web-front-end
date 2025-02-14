"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Percent, Tag } from "lucide-react";
import { useState } from "react";

const ProductDetailsCoupon = () => {
      const [couponCode, setCouponCode] = useState("");
      const [showCouponInput, setShowCouponInput] = useState(false);
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
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button>Apply</Button>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Percent className="h-4 w-4" />
                    <span>Available Coupons:</span>
                  </div>
                  {["NEWUSER20", "WEEKEND10"].map((code) => (
                    <Button
                      key={code}
                      variant="outline"
                      size="sm"
                      className="w-full justify-between"
                      onClick={() => setCouponCode(code)}
                    >
                      <span className="font-mono">{code}</span>
                      <span className="text-sm text-muted-foreground">
                        Up to 20% off
                      </span>
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


