import { Progress } from "@/components/ui/progress";
import { StatusStep } from "@/types/order";
import { XCircle } from "lucide-react";
import { useMemo } from "react";

interface Order {
  order_status: string;
}

export const OrderTimeline = ({
  orderStatus,
  statusSteps,
}: {
  orderStatus: Order;
  statusSteps: StatusStep[];
}) => {
  const getStatusIndex = (status: string) =>
    statusSteps.findIndex((step: StatusStep) => step.status === status);

  const getProgressPercentage = (status: string) => {
    if (status === "canceled") return 100;
    return ((getStatusIndex(status) + 1) / statusSteps.length) * 100;
  };

  const progressPercentage = useMemo(() => {
    if (!orderStatus?.order_status) return 0;
    return getProgressPercentage(orderStatus.order_status);
  }, [orderStatus?.order_status]);

  const isCanceled = orderStatus.order_status === "canceled";

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-xl">Order Timeline</h3>
      <div className="relative">
        <Progress
          value={progressPercentage}
          className={`h-2 ${
            isCanceled ? "bg-gray-200 [&>div]:bg-red-500" : ""
          }`}
        />
        <div className="flex justify-between mt-2">
          {isCanceled ? (
            <div className="w-full flex flex-col items-center">
              <div className="rounded-full h-10 w-10 flex items-center justify-center bg-red-500">
                <XCircle className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs mt-2 text-center text-red-500 font-medium">
                Order Canceled
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This order has been canceled
              </p>
            </div>
          ) : (
            statusSteps.map((step, index) => {
              const isCompleted =
                getStatusIndex(orderStatus.order_status) >= index;
              const textColorClass = isCompleted
                ? step.color.replace("bg-", "text-")
                : "text-gray-500";

              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center ${
                      isCompleted ? step.color : "bg-gray-200"
                    }`}
                  >
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className={`text-xs mt-2 text-center ${textColorClass}`}>
                    {step.label}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
