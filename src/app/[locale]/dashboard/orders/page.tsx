"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import defaultConfig from "@/config/config";
import { api } from "@/lib/api/api";
import { ImageType } from "@/types/image";
import type { Order, OrderListResponse } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, DollarSign, MapPin, Package2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "history">("ongoing");
  const { toast } = useToast();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<OrderListResponse>({
    queryKey: ["orders", activeTab],
    queryFn: async () => {
      const response = await api.get(
        `/customer/order/list?order_filter=${
          activeTab === "ongoing" ? "running_order" : "past_order"
        }`
      );
      return response.data;
    },
  });

  const getStatusColor = (status: Order["order_status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "processing":
      case "confirmed":
        return "bg-blue-500";
      case "canceled":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load orders. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-primary-text" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{orders?.total_size || 0}</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Package2 className="h-6 w-6 text-primary-text" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ongoing</p>
            <p className="text-2xl font-bold">
              {orders?.orders?.filter(
                (order: Order) =>
                  !["delivered", "canceled", "failed", "returned"].includes(
                    order.order_status
                  )
              ).length || 0}
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Clock className="h-6 w-6 text-primary-text" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Processing</p>
            <p className="text-2xl font-bold">
              {orders?.orders?.filter(
                (order: Order) => order.order_status === "processing"
              ).length || 0}
            </p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-primary-text" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">
              {defaultConfig.currency_symbol}
              {orders?.orders
                ?.reduce(
                  (acc: number, order: Order) => acc + order.order_amount,
                  0
                )
                .toFixed(2) || "0.00"}
            </p>
          </div>
        </Card>
      </div>

      <Tabs
        defaultValue="ongoing"
        className="w-full"
        onValueChange={(value) => setActiveTab(value as "ongoing" | "history")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="ongoing">Ongoing Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : orders?.orders?.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Ongoing Orders
                </h3>
                <p className="text-muted-foreground">
                  You don't have any ongoing orders at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders?.orders?.map((order: Order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group"
                  >
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <div className="flex -space-x-4">
                            {order.product_images
                              .slice(0, 3)
                              .map((image, index) => (
                                <div
                                  key={index}
                                  className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-background"
                                >
                                  <CustomImage
                                    type={ImageType.PRODUCT}
                                    src={image || "/placeholder.svg"}
                                    alt={`Order ${order.id} product ${
                                      index + 1
                                    }`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            {order.product_images.length > 3 && (
                              <div className="relative w-16 h-16 rounded-lg bg-muted flex items-center justify-center border-2 border-background">
                                <span className="text-sm font-medium">
                                  +{order.product_images.length - 3}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                Order #{order.id}
                              </h3>
                              <Badge
                                variant="outline"
                                className={getStatusColor(order.order_status)}
                              >
                                {order.order_status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {format(new Date(order.created_at), "PPP")}
                            </p>
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2">
                                <Package2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {order.total_quantity} items
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {defaultConfig.currency_symbol}
                                  {order.order_amount.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {order.preparation_time} min preparation time
                                </span>
                              </div>
                            </div>
                          </div>

                          <Button variant="ghost" className="ml-auto">
                            View Details
                          </Button>
                          <Link href={`/order-tracking?order_id=${order.id}`}>
                            <Button variant="default" className="ml-auto">
                              <MapPin className="h-4 w-4 mr-2" />
                              Track Order
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="history">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : orders?.orders?.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Order History</h3>
                <p className="text-muted-foreground">
                  You haven't placed any orders yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders?.orders?.map((order: Order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group"
                  >
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Card className="p-6  transition-shadow">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <div className="flex -space-x-4">
                            {order.product_images
                              .slice(0, 3)
                              .map((image, index) => (
                                <div
                                  key={index}
                                  className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-background"
                                >
                                  <CustomImage
                                    type={ImageType.PRODUCT}
                                    src={image || "/placeholder.svg"}
                                    alt={`Order ${order.id} product ${
                                      index + 1
                                    }`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            {order.product_images.length > 3 && (
                              <div className="relative w-16 h-16 rounded-lg bg-muted flex items-center justify-center border-2 border-background">
                                <span className="text-sm font-medium">
                                  +{order.product_images.length - 3}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                Order #{order.id}
                              </h3>
                              <Badge
                                variant="outline"
                                className={getStatusColor(order.order_status)}
                              >
                                {order.order_status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {format(new Date(order.created_at), "PPP")}
                            </p>
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2">
                                <Package2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {order.total_quantity} items
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  ${order.order_amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <Button variant="ghost" className="ml-auto">
                            View Details
                          </Button>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
