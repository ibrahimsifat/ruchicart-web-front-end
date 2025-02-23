"use client";

import { useToast } from "@/components/ui/use-toast";

import CheckoutSkeleton from "@/components/skeleton/checkout-skeleton";
import OrderSummarySkeleton from "@/components/skeleton/orderSummary-skeleton";
import { placeOrder } from "@/lib/api/order";
import { useWalletTransactions } from "@/lib/hooks/queries/wallet/useWallet";
import { formatVariations } from "@/lib/utils/cart";
import { isProductAvailable } from "@/lib/utils/product-availability";
import { formSchema } from "@/lib/utils/schema";
import { useAuthStore } from "@/store/authStore";
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

export default function Checkout() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, total, itemCount, clearCart } = useCart();
  const [unavailableItems, setUnavailableItems] = useState<string[]>([]);
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
  const { token } = useAuthStore();
  const [transactionType, setTransactionType] = useState<string>("");
  const [finalTotal, setFinalTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  console.log("finalTotal", finalTotal);
  useEffect(() => {
    // if (itemCount === 0) {
    //   router.push("/");
    // }

    const checkAvailability = () => {
      const unavailable = items
        .filter(
          (item) =>
            !isProductAvailable(
              item.available_time_starts || "",
              item.available_time_ends || ""
            )
        )
        .map((item) => item.name);
      setUnavailableItems(unavailable);
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [itemCount, router, items]);
  // redirect to guest checkout if user is not authenticated
  useEffect(() => {
    if (!token) {
      router.push("/guest-checkout");
    }
  }, [token, router]);

  // redirect to home if cart is empty
  // useEffect(() => {
  //   if (itemCount === 0) {
  //     router.push("/");
  //   }
  // }, [itemCount, router, token]);

  const { data: transactions } = useWalletTransactions(
    transactionType,
    page,
    limit
  );
  const walletBalance = transactions?.data[0]?.balance || 0;

  const handlePlaceOrder = async (orderData: z.infer<typeof formSchema>) => {
    if (unavailableItems.length > 0) {
      toast({
        title: "Error",
        description: "Please remove unavailable items from your cart",
        variant: "destructive",
      });
      return;
    }

    if (orderData.payment_method === "wallet") {
      console.log("walletBalance", walletBalance);

      if (finalTotal > walletBalance) {
        toast({
          title: "Error",
          description: "Insufficient wallet balance",
          variant: "destructive",
        });
        console.log("Insufficient wallet balance");
        return;
      }

      console.log(walletBalance);
      console.log(finalTotal);

      //TODO: handle partial payment
      // If partial payment, handle the remaining amount
      // if (walletBalance < total) {
      //   const remainingAmount = total - walletBalance;
      // Here you would typically redirect to a payment gateway for the remaining amount
      // For this example, we'll just show a message
      // toast({
      //   title: "Partial Payment",
      //   description: `Please pay the remaining ${remainingAmount} through another method.`,
      // });
    }

    setIsLoading(true);
    try {
      // Add cart data from the cart state
      const orderDataWithCart = {
        ...orderData,
        order_amount: finalTotal,
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
    return (
      <div>
        <CheckoutSkeleton />
      </div>
    );
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
              setFinalTotal={setFinalTotal}
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
