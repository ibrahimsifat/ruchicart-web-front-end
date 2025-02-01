"use client";

import { CheckoutForm } from "@/features/checkout/checkout-form";
import { OrderSummary } from "@/features/checkout/order-summary";
import { Footer } from "@/features/layout/footer";
import { Navbar } from "@/features/layout/navbar";
import { TopBar } from "@/features/layout/top-bar";
import { useCart } from "@/store/cart";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, itemCount } = useCart();

  // Redirect if cart is empty
  if (itemCount === 0) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
