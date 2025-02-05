"use client";

import { useToast } from "@/components/ui/use-toast";
import { CheckoutForm } from "@/features/checkout/checkout-form";
import { OrderSummary } from "@/features/checkout/order-summary";
import { placeOrder } from "@/lib/api/order";
import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as z from "zod";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, total, itemCount, clearCart } = useCart();

  const [deliveryTip, setDeliveryTip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);

  useEffect(() => {
    if (itemCount === 0) {
      router.push("/");
    }
  }, [itemCount, router]);

  const formSchema = z.object({
    order_amount: z.number(),
    payment_method: z.string().min(1, "Please select a payment method"),
    order_type: z.enum(["delivery", "take_away"]),
    delivery_address_id: z.number().optional(),
    branch_id: z.string(),
    delivery_time: z.string(),
    delivery_date: z.string(),
    distance: z.number(),
    is_partial: z.number(),
    delivery_tip: z.number().optional(),
    stripe_payment_intent_id: z.string().optional(),
    cart: z.array(
      z.object({
        product_id: z.string(),
        quantity: z.number(),
        variant: z.array(),
        add_on_ids: z.array(),
        add_on_qtys: z.array(),
      })
    ),
    change_amount: z.string().optional(),

    guest_id: z.string().optional(),
  });
  // CheckoutPage.tsx
  const handlePlaceOrder = async (orderData: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Add cart data from the cart state
      const orderDataWithCart = {
        ...orderData,
        cart: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          variant: [],
          add_on_ids: [],
          add_on_qtys: [],
        })),
      };

      const response = await placeOrder(orderDataWithCart);
      if (response.status !== 200) {
        throw new Error("Failed to place order");
      }

      const data = response.data;
      //TODO:: clearCart
      // clearCart();
      router.push(`/order-confirmation/${data.order_id}`);

      toast({
        title: "Success",
        description: "Your order has been placed successfully!",
      });
    } catch (error) {
      console.error("Order placement error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (itemCount === 0) {
    return null;
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm
              onSubmit={handlePlaceOrder}
              setIsCashOnDelivery={setIsCashOnDelivery}
              isLoading={isLoading}
              deliveryTip={deliveryTip}
              setDeliveryTip={setDeliveryTip}
            />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              total={total}
              deliveryTip={deliveryTip}
              isCashOnDelivery={isCashOnDelivery}
            />
          </div>
        </div>
      </main>
    </>
  );
}
