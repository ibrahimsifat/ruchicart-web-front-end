import { CheckoutSkeleton } from "@/components/skeleton/checkout-skeleton";
import Checkout from "@/features/checkout";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <Checkout />
    </Suspense>
  );
}
