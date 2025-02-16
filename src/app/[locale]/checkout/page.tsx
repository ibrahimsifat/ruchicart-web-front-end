import { CheckoutSkeleton } from "@/components/skeleton/checkout-skeleton";
import Checkout from "@/features/checkout";
import { Suspense } from "react";
import PageLayout from "../layouts/pageLayout";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <PageLayout>
        <Checkout />
      </PageLayout>
    </Suspense>
  );
}
