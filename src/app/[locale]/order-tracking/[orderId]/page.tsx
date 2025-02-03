"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/authStore";
import { Clock, DollarSign, MapPin, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderTrackingProps {
  params: {
    orderId: string;
  };
}

export default function OrderTrackingPage({ params }: OrderTrackingProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { token, getGuestId } = useAuthStore();
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await fetch("/api/order/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: params.orderId,
            guest_id: !token ? getGuestId() : undefined,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch order status");
        }
        const data = await response.json();
        setOrderStatus(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch order status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStatus();
  }, [params.orderId, toast, token, getGuestId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orderStatus) {
    return <div>Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order Tracking</span>
            <Badge
              variant={
                orderStatus.status === "delivered" ? "success" : "secondary"
              }
            >
              {orderStatus.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span className="font-semibold">Order ID:</span>
              </div>
              <span>{params.orderId}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold">Estimated Delivery Time:</span>
              </div>
              <span>{orderStatus.estimated_delivery_time}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-semibold">Delivery Address:</span>
              </div>
              <span className="text-right">{orderStatus.delivery_address}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-semibold">Total Amount:</span>
              </div>
              <span>${orderStatus.total_amount.toFixed(2)}</span>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Order Items:</h3>
              <ul className="space-y-2">
                {orderStatus.items.map((item: any) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={() => router.push("/")} className="w-full">
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
