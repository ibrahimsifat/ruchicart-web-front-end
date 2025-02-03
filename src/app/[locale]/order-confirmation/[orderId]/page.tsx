"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/authStore";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderConfirmationProps {
  params: {
    orderId: string;
  };
}

export default function OrderConfirmationPage({
  params,
}: OrderConfirmationProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { token, getGuestId } = useAuthStore();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `/api/order/details?order_id=${params.orderId}&guest_id=${
            !token ? getGuestId() : ""
          }`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch order details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.orderId, toast, token, getGuestId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orderDetails) {
    return <div>Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-2xl">
            <CheckCircle className="text-green-500 mr-2" />
            Order Confirmed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-lg">Thank you for your order!</p>
            <p>
              Order ID: <span className="font-semibold">{orderDetails.id}</span>
            </p>
            <p>
              Total Amount:{" "}
              <span className="font-semibold">
                ${orderDetails.order_amount.toFixed(2)}
              </span>
            </p>
            <p>
              Status:{" "}
              <span className="font-semibold">{orderDetails.order_status}</span>
            </p>
            <div className="flex justify-center space-x-4 mt-8">
              <Button
                onClick={() => router.push(`/order-tracking/${params.orderId}`)}
              >
                Track Order
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
