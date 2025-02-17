import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const OrderSummarySkeleton = () => {
  return (
    <div className="lg:col-span-1">
      <Card className="p-6">
        <Skeleton className="h-7 w-40 mb-6" />

        {/* Apply Coupon Skeleton */}
        <Skeleton className="h-10 w-full mb-6" />

        {/* Unavailable Items Skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-20 w-full" />
        </div>

        {/* Cart Items Skeleton */}
        <div className="space-y-4 mb-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

        {/* Order Calculations Skeleton */}
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
          <div className="flex justify-between pt-4 border-t mt-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderSummarySkeleton;
