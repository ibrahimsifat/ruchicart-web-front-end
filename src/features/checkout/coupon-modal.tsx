"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { getCoupons } from "@/lib/hooks/coupon/useCoupon";
import type { Coupon } from "@/types/coupon";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Copy, Search, Tag, X } from "lucide-react";
import { useState } from "react";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (coupon: Coupon) => void;
  selectedCoupon?: Coupon | null;
  orderAmount: number;
}

export function CouponModal({
  isOpen,
  onClose,
  onSelect,
  selectedCoupon,
  orderAmount,
}: CouponModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: getCoupons,
  });

  const filteredCoupons = coupons.filter(
    (coupon) =>
      (coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      new Date(coupon.expire_date) > new Date() &&
      orderAmount >= coupon.min_purchase
  );

  const calculateDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === "percent") {
      const discount = (orderAmount * coupon.discount) / 100;
      return Math.min(discount, coupon.max_discount);
    }
    return Math.min(coupon.discount, coupon.max_discount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-primary/5">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Available Coupons
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <ScrollArea className="h-[400px] -mx-6 px-6">
            <div className="space-y-4 pr-4">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-32 rounded-lg bg-muted animate-pulse"
                    />
                  ))
              ) : filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => {
                  const isSelected = selectedCoupon?.id === coupon.id;
                  const discount = calculateDiscount(coupon);

                  return (
                    <div
                      key={coupon.id}
                      className={`relative rounded-xl border p-6 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2"
                          : "hover:border-primary/50 cursor-pointer group"
                      }`}
                      onClick={() => onSelect(coupon)}
                    >
                      <div className="absolute right-2 top-2">
                        <div className="relative h-20 w-20 overflow-hidden">
                          <div className="flex items-center gap-1.5 text-primary">
                            <span className="text-2xl font-bold">
                              {coupon.discount_type === "percent"
                                ? `${coupon.discount}%`
                                : `$${coupon.discount}`}
                            </span>
                            <span className="text-sm font-medium">OFF</span>
                          </div>
                          <div className="absolute -right-10 top-10 h-20 w-20 -rotate-45 bg-primary/10" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">
                            {coupon.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Valid until{" "}
                            {format(new Date(coupon.expire_date), "PP")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
                            <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
                            <code className="relative block bg-muted px-4 py-2 font-mono text-sm font-medium text-center">
                              {coupon.code}
                            </code>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 text-xs whitespace-nowrap"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(coupon.code);
                              toast({
                                title: "Copied to clipboard",
                                description:
                                  "Coupon code has been copied to your clipboard",
                                duration: 2000,
                              });
                            }}
                          >
                            <Copy className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <div className="rounded-full bg-muted px-2.5 py-1">
                            Min. Purchase: ${coupon.min_purchase}
                          </div>
                          <div className="rounded-full bg-muted px-2.5 py-1">
                            Max. Discount: ${coupon.max_discount}
                          </div>
                          {coupon.limit && (
                            <div className="rounded-full bg-muted px-2.5 py-1">
                              {coupon.limit} uses per user
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          {isSelected && (
                            <div className="flex items-center gap-1.5 text-primary">
                              <span className="text-sm font-medium">
                                You save
                              </span>
                              <span className="font-bold">
                                ${discount.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <X className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No coupons found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
