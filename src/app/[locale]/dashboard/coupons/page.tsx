"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CouponCard } from "@/features/coupon/couponCard";
import { applyCoupon, getCoupons, type Coupon } from "@/lib/api/coupon";
import { isCouponValid } from "@/lib/utils/date";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const { toast } = useToast();

  const {
    data: coupons,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: getCoupons,
  });

  const handleApplyCoupon = async (coupon: Coupon) => {
    try {
      await applyCoupon(coupon.code);
      toast({
        title: "Coupon applied successfully!",
        description: `${coupon.code} has been applied to your order.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to apply coupon",
        description:
          error.response?.data?.errors?.[0]?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredCoupons = coupons?.filter((coupon) => {
    const matchesSearch =
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase());
    const isValid = isCouponValid(coupon.start_date, coupon.expire_date);
    return matchesSearch && (activeTab === "active" ? isValid : !isValid);
  });

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load coupons</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Coupons</CardTitle>
          <CardDescription>
            View and manage your available coupons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coupons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-[200px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredCoupons?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No coupons found</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredCoupons?.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onApply={handleApplyCoupon}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
