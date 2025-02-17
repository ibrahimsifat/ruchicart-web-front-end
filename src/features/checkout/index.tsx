"use client";

import { useToast } from "@/components/ui/use-toast";

import CheckoutSkeleton from "@/components/skeleton/checkout-skeleton";
import OrderSummarySkeleton from "@/components/skeleton/orderSummary-skeleton";
import { placeOrder } from "@/lib/api/order";
import { formatVariations } from "@/lib/utils/cart";
import { useCart } from "@/store/cartStore";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as z from "zod";
// lazy loading
const OrderSummary = dynamic(
  () => import("@/features/order/orderSummary").then((mod) => mod.OrderSummary),
  {
    loading: () => <OrderSummarySkeleton />,
    ssr: false,
  }
);

const CheckoutForm = dynamic(
  () =>
    import("@/features/checkout/checkout-form").then((mod) => mod.CheckoutForm),
  {
    loading: () => <CheckoutSkeleton />,
    ssr: false,
  }
);

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, total, itemCount, clearCart } = useCart();

  const [deliveryTip, setDeliveryTip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);

  // redirect to home if cart is empty
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
        variant: z.array(
          z.object({
            name: z.string(),
            values: z.array(
              z.object({
                label: z.array(z.string()),
                optionPrice: z.number(),
              })
            ),
          })
        ),
        add_on_ids: z.array(z.number()),
        add_on_qtys: z.array(z.number()),
      })
    ),
    change_amount: z.string().optional(),

    guest_id: z.string().optional(),
  });

  const handlePlaceOrder = async (orderData: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Add cart data from the cart state
      const orderDataWithCart = {
        ...orderData,
        cart: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          variant: item.variant || [],
          variations: formatVariations(item.variations || {}),
          add_on_ids: item.add_ons?.map((addOn) => addOn.id) || [],
          add_on_qtys: item.add_ons?.length ? [item.add_ons.length] : [],
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
