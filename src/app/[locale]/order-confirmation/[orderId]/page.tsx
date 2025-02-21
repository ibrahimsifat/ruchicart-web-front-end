"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import defaultConfig from "@/config/config";
import { useOrderTrack } from "@/lib/hooks/queries/order/useOrders";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

interface CheckmarkProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.2,
        type: "spring",
        duration: 1.5,
        bounce: 0.2,
        ease: "easeInOut",
      },
      opacity: { delay: i * 0.2, duration: 0.2 },
    },
  }),
};

export function Checkmark({
  size = 100,
  strokeWidth = 2,
  color = "currentColor",
  className = "",
}: CheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <title>Animated Checkmark</title>
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        variants={draw}
        custom={0}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      <motion.path
        d="M30 50L45 65L70 35"
        stroke={color}
        variants={draw}
        custom={1}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "transparent",
        }}
      />
    </motion.svg>
  );
}

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const { token, getGuestId } = useAuthStore();
  const { data: orderTrack, isLoading } = useOrderTrack({
    order_id: params.orderId,
    guest_id: !token ? getGuestId() : "",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orderTrack) {
    return <div>Order not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
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
            Order Confirmed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-lg">Thank you for your order!</p>
            <p>
              Order ID: <span className="font-semibold">{orderTrack.id}</span>
            </p>
            <p>
              Order Date:{" "}
              <span className="font-semibold">
                {new Date(orderTrack.updated_at).toLocaleDateString()}
              </span>
            </p>
            <p>
              Branch Name:{" "}
              <span className="font-semibold">{orderTrack.branch.name}</span>
            </p>

            <p>
              Total Amount:{" "}
              <span className="font-semibold">
                {defaultConfig.currency_symbol}${orderTrack.order_amount}
              </span>
            </p>
            <p>
              Status:{" "}
              <span className="font-semibold">{orderTrack.order_status}</span>
            </p>
            <p>
              Payment Status:{" "}
              <span className="font-semibold">{orderTrack.payment_status}</span>
            </p>
            <p>
              Payment Method:{" "}
              <span className="font-semibold">{orderTrack.payment_method}</span>
            </p>
            <p>
              Delivery Time:{" "}
              <span className="font-semibold">{orderTrack.delivery_time}</span>
            </p>

            <div className="flex justify-center space-x-4 mt-8">
              {/* <Button
                onClick={() => router.push(`/order-tracking/${params.orderId}`)}
              >
                Track Order
              </Button> */}
              {/* <Button variant="outline" onClick={() => router.push("/")}>
                Continue Shopping
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
