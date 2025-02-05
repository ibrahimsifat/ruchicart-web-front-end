import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/store/cart";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  RefreshCcw,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderFeedback } from "./order-feedback";

interface OrderHistoryItemProps {
  order: {
    id: string;
    order_status: string;
    created_at: string;
    order_amount: number;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    feedback?: any; // Added feedback property to the order interface
  };
}

export function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { addItem } = useCart();
  const [showFeedback, setShowFeedback] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`/api/order/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      toast({
        title: "Order Cancelled",
        description: `Order #${order.id} has been cancelled successfully.`,
      });

      // Refresh the page or update the order status
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel the order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: "/placeholder.svg", // You might want to store and use the actual image URL
      });
    });

    toast({
      title: "Items Added to Cart",
      description:
        "The items from your previous order have been added to your cart.",
    });

    router.push("/cart");
  };

  const handleFeedbackSubmit = () => {
    setShowFeedback(false);
    // You might want to refresh the order data here to show the submitted feedback
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
        <Badge
          variant={order.order_status === "delivered" ? "success" : "secondary"}
        >
          {order.order_status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Ordered on {formatDate(order.created_at)}
            </p>
            <p className="font-semibold">
              Total: ${order.order_amount.toFixed(2)}
            </p>
          </div>
          <div className="space-x-2">
            <Button onClick={() => router.push(`/order-tracking/${order.id}`)}>
              Track Order
            </Button>
            {order.order_status === "pending" && (
              <Button variant="destructive" onClick={handleCancelOrder}>
                <X className="mr-2 h-4 w-4" /> Cancel Order
              </Button>
            )}
            <Button variant="outline" onClick={handleReorder}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Re-order
            </Button>
            {order.order_status === "delivered" && !order.feedback && (
              <Button variant="outline" onClick={() => setShowFeedback(true)}>
                <MessageSquare className="mr-2 h-4 w-4" /> Leave Feedback
              </Button>
            )}
          </div>
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center w-full justify-between"
            >
              {isOpen ? "Hide" : "Show"} Order Details
              {isOpen ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
        {showFeedback && (
          <div className="mt-4">
            <OrderFeedback
              orderId={order.id}
              onFeedbackSubmit={handleFeedbackSubmit}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
