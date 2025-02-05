"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useOrderTrack } from "@/lib/hooks/queries/order/useOrders";
import { useAuthStore } from "@/store/authStore";
import { CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const { token, getGuestId } = useAuthStore();
  const { data: orderTrack, isLoading } = useOrderTrack({
    order_id: params.orderId,
    guest_id: !token ? getGuestId() : "",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orderTrack) {
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
              Order ID: <span className="font-semibold">{orderTrack.id}</span>
            </p>
            <p>
              Order Date:{" "}
              <span className="font-semibold">
                {new Date(orderTrack.updated_at).toLocaleDateString()}
              </span>
            </p>
            <p>
              Branch Name:{" "}
              <span className="font-semibold">{orderTrack.branch.name}</span>
            </p>

            <p>
              Total Amount:{" "}
              <span className="font-semibold">${orderTrack.order_amount}</span>
            </p>
            <p>
              Status:{" "}
              <span className="font-semibold">{orderTrack.order_status}</span>
            </p>
            <p>
              Payment Status:{" "}
              <span className="font-semibold">{orderTrack.payment_status}</span>
            </p>
            <p>
              Payment Method:{" "}
              <span className="font-semibold">{orderTrack.payment_method}</span>
            </p>
            <p>
              Delivery Time:{" "}
              <span className="font-semibold">{orderTrack.delivery_time}</span>
            </p>

            <div className="flex justify-center space-x-4 mt-8">
              {/* <Button
                onClick={() => router.push(`/order-tracking/${params.orderId}`)}
              >
                Track Order
              </Button> */}
              {/* <Button variant="outline" onClick={() => router.push("/")}>
                Continue Shopping
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
