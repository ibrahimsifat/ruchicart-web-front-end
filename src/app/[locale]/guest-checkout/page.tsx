"use client";

import PageLayout from "@/app/[locale]/layouts/pageLayout";
import GuestCheckout from "@/features/checkout/guestCheckout";
export default function GuestCheckoutPage() {
  return (
    <PageLayout>
      <GuestCheckout />
    </PageLayout>
  );
}
