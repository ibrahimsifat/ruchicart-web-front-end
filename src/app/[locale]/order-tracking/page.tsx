"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BranchInfo } from "@/features/order-traking/BranchInfo";
import { DeliveryInfo } from "@/features/order-traking/DeliveryInfo";
import { OrderDetails } from "@/features/order-traking/OrderDetails";
import { OrderItems } from "@/features/order-traking/OrderItems";
import { NoOrderFound } from "@/features/order-traking/OrderNotFound";
import {
  OrderTimeline,
  StatusStep,
} from "@/features/order-traking/OrderTimeline";
import { api } from "@/lib/api/api";
import { queryKeys } from "@/lib/api/queries";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AxiosError } from "axios";
import { CheckCircle, Clock, Package, Search, Truck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PageLayout from "../layouts/pageLayout";

// Define status steps
export const statusSteps: StatusStep[] = [
  {
    status: "pending",
    label: "Order Placed",
    icon: Package,
    color: "bg-yellow-500",
  },
  {
    status: "confirmed",
    label: "Order Confirmed",
    icon: CheckCircle,
    color: "bg-blue-500",
  },
  {
    status: "processing",
    label: "Order Processing",
    icon: Clock,
    color: "bg-purple-500",
  },
  {
    status: "out_for_delivery",
    label: "Out for Delivery",
    icon: Truck,
    color: "bg-orange-500",
  },
  {
    status: "delivered",
    label: "Order Delivered",
    icon: CheckCircle,
    color: "bg-green-500",
  },
];
// Loading Spinner

// Main Component
export default function OrderTrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("order_id");
  const { toast } = useToast();
  const { token, getGuestId } = useAuthStore();
  const [orderId, setOrderId] = useState(orderIdParam);

  const {
    data: orderStatus,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.orders.track(orderId),
    queryFn: async () => {
      if (!orderId) return null;

      try {
        const response = await api.get("/customer/order/track", {
          params: {
            order_id: orderId,
            guest_id: token ? undefined : getGuestId(),
          },
        });

        return response.data || null;
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          return null;
        }
        throw err;
      }
    },
    enabled: !!orderId,
    retry: false,
  });

  useEffect(() => {
    if (orderIdParam) {
      refetch();
    }
  }, [orderIdParam, refetch]);

  const handleTrackOrder = useCallback(() => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive",
      });
      return;
    }
    refetch();
  }, [orderId, refetch]);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8  min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8  duration-300">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-primary-text">
                Track Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Enter Order ID"
                    value={orderId || ""}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-full border-2 border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <Button
                  onClick={handleTrackOrder}
                  className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary-dark transition-colors duration-300"
                >
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {isLoading && <LoadingSpinner />}
          {orderStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <Card className=" duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary to-primary/30 text-white">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      Order #{orderStatus.id}
                    </span>
                    <Badge className="text-lg px-4 py-2 bg-white text-primary-text font-bold">
                      {orderStatus.order_status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <OrderTimeline
                      orderStatus={orderStatus}
                      statusSteps={statusSteps}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between">
                      <OrderDetails orderStatus={orderStatus} />
                      <DeliveryInfo orderStatus={orderStatus} />
                    </div>
                    <OrderItems orderStatus={orderStatus} />
                    <BranchInfo orderStatus={orderStatus} />
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full max-w-md rounded-full bg-primary hover:bg-primary-dark transition-colors duration-300"
                >
                  Back to Home
                </Button>
              </div>
            </motion.div>
          )}
          {!orderStatus && !isLoading && <NoOrderFound />}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
