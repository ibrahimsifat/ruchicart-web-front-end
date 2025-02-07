"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { ImageType } from "@/types/image";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Order {
  id: number;
  order_amount: number;
  created_at: string;
  order_status: string;
  payment_status: string;
  order_type: string;
  total_quantity: string;
  delivery_address_id: number;
  product_images: string[];
}

interface OrderHistoryItemProps {
  order: Order;
}

export function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "processing":
      case "confirmed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Order #{order.id}</CardTitle>
        <Button variant="ghost" onClick={toggleExpand}>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            {format(new Date(order.created_at), "PPP")}
          </span>
          <Badge className={getStatusColor(order.order_status)}>
            {order.order_status}
          </Badge>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>Total: ${order.order_amount.toFixed(2)}</span>
          <span>Quantity: {order.total_quantity}</span>
        </div>
        {isExpanded && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold">Order Type</h4>
                <p>{order.order_type}</p>
              </div>
              <div>
                <h4 className="font-semibold">Payment Status</h4>
                <p>{order.payment_status}</p>
              </div>
              <div>
                <h4 className="font-semibold">Delivery Address ID</h4>
                <p>{order.delivery_address_id}</p>
              </div>
            </div>
            <h4 className="font-semibold mb-2">Product Images</h4>
            <div className="flex flex-wrap gap-2">
              {order.product_images.map((image, index) => (
                <CustomImage
                  key={index}
                  src={image}
                  type={ImageType.PRODUCT}
                  alt={`Product ${index + 1}`}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
