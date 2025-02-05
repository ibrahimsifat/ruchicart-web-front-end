"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderTracking() {
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuthStore();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/order/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          phone: phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to track order");
      }

      const data = await response.json();
      router.push(`/order-tracking/${data.order_id}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to track order. Please check your order ID and phone number.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrackOrder} className="space-y-4">
          <Input
            type="text"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
          {!token && (
            <Input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Tracking..." : "Track Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
