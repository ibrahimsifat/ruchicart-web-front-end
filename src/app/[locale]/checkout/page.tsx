import Checkout from "@/features/category";
import { Suspense } from "react";
import PageLayout from "../layouts/PageLayout";

export default function CheckoutPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Checkout />
      </Suspense>
    </PageLayout>
  );
}
