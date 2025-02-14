import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import AppPromotion from "./app-promotion";
import CreditCartPromotion from "./credit-cart-promotion";
import ProductDetailsCoupon from "./product-details-coupon";
export function PaymentPromotions() {
  return (
    <div className="space-y-6">
      {/* Mobile App Promotion */}
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <AppPromotion />
      </Suspense>

      {/* Credit Card Promotion */}
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <CreditCartPromotion />
      </Suspense>

      {/* Coupon Section */}
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <ProductDetailsCoupon />
      </Suspense>
    </div>
  );
}
