"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { DeliveryInfoCard } from "@/features/dashboard/order/DeliveryInfoCard";
import { OrderItemsCard } from "@/features/dashboard/order/OrderItemsCard";
import { OrderStatusBadge } from "@/features/dashboard/order/OrderStatusBadge";
import { OrderSummaryCard } from "@/features/dashboard/order/OrderSummaryCard";
import UserReviewDisplay from "@/features/dashboard/order/UserReviewDisplay";
import { api } from "@/lib/api/api";
import { getQueryClient, queryKeys } from "@/lib/api/queries";
import { useOrderDetails } from "@/lib/hooks/queries/order/useOrders";
import { useAuthStore } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Clock, Package2, Truck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = getQueryClient();
  const [reviewingDeliveryManId, setReviewingDeliveryManId] = useState<
    number | null
  >(null);
  const [reviewingProductId, setReviewingProductId] = useState<number | null>(
    null
  );
  const { data: orderDetails, isLoading } = useOrderDetails(id as string);

  const cancelOrderMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/customer/order/cancel`, { order_id: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.details(id as string),
      });
      toast({
        title: "Order Canceled",
        description: "Your order has been successfully canceled.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/4 bg-muted rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-40 bg-muted rounded" />
              <div className="h-40 bg-muted rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-muted rounded" />
              <div className="h-40 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails || orderDetails.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/dashboard/orders")}>
            View All Orders
          </Button>
        </div>
      </div>
    );
  }

  const order = orderDetails[0].order;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => router.push("/dashboard/orders")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <h2 className="text-2xl font-bold">#{order.id}</h2>
                </div>
                <OrderStatusBadge status={order.order_status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(order.created_at), "PPP")}
                </div>
                <div className="flex items-center gap-1">
                  <Package2 className="h-4 w-4" />
                  {orderDetails.length} items
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  {order.order_type}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <DeliveryInfoCard
            order={order}
            user={user}
            reviewingDeliveryManId={reviewingDeliveryManId}
            setReviewingDeliveryManId={setReviewingDeliveryManId}
          />

          {/* Order Items */}
          <OrderItemsCard orderDetails={orderDetails} />

          {/* Review Section */}
          {order.order_status === "delivered" && (
            <Card>
              <CardHeader>
                <CardTitle>Product Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {orderDetails.map((item) => (
                  <div
                    key={item.id}
                    className="mb-4 pb-4 border-b last:border-b-0"
                  >
                    <h4 className="font-medium text-lg mb-2">
                      {item.product_details.name}
                    </h4>
                    {item.reviews && user?.id && (
                      <UserReviewDisplay
                        reviews={item.reviews}
                        productId={item.product_id}
                        userId={user.id}
                        reviewingProductId={reviewingProductId}
                        setReviewingProductId={setReviewingProductId}
                        orderId={order.id}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <OrderSummaryCard
          order={order}
          cancelOrderMutation={cancelOrderMutation}
        />
      </div>
    </div>
  );
}
