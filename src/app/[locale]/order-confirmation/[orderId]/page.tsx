"use client";

import OrderConfirmationSkeleton from "@/components/skeleton/confirm-order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkmark } from "@/components/ui/Checkmark";
import { BranchInfo } from "@/features/order-traking/BranchInfo";
import { DeliveryInfo } from "@/features/order-traking/DeliveryInfo";
import { OrderDetails } from "@/features/order-traking/OrderDetails";
import { OrderItems } from "@/features/order-traking/OrderItems";
import { OrderTimeline } from "@/features/order-traking/OrderTimeline";
import { useRouter } from "@/i18n/routing";
import PageLayout from "@/layouts/pageLayout";
import { useOrderTrack } from "@/lib/hooks/queries/order/useOrders";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { statusSteps } from "../../order-tracking/page";

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const { token, getGuestId } = useAuthStore();
  const router = useRouter();
  const { data: orderTrack, isLoading } = useOrderTrack({
    order_id: params.orderId,
    guest_id: !token ? getGuestId() : "",
  });
  console.log("orderTrack", orderTrack);
  if (isLoading) {
    return <OrderConfirmationSkeleton />;
  }

  if (!orderTrack) {
    return <div>Order not found</div>;
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-8 ">
          <Card className="w-full mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-2xl">
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 blur-xl bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                  <Checkmark
                    size={80}
                    strokeWidth={4}
                    color="rgb(16 185 129)"
                    className="relative z-10 dark:drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <Card className=" duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary to-primary/10 text-white">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      Order #{orderTrack.id}
                    </span>
                    <Badge className="text-lg px-4 py-2 text-primary-text font-bold">
                      {orderTrack.order_status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <OrderTimeline
                      orderStatus={orderTrack}
                      statusSteps={statusSteps}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between">
                      <OrderDetails orderStatus={orderTrack} />
                      <DeliveryInfo
                        orderAddress={orderTrack?.delivery_address?.address}
                        orderStatus={orderTrack}
                      />
                    </div>
                    <OrderItems orderStatus={orderTrack} />
                    <BranchInfo orderStatus={orderTrack} />
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full max-w-md rounded-full bg-primary hover:bg-primary-dark transition-colors duration-300"
                >
                  Back to Home
                </Button>
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
