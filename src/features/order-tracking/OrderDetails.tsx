import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";

import { Calendar, Clock, CreditCard, DollarSign, Info } from "lucide-react";

export const OrderDetails = ({ orderStatus }: { orderStatus: Order }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-xl">Order Details</h3>
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Order Date:</span>
        <span>{new Date(orderStatus.created_at).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Order Time:</span>
        <span>{new Date(orderStatus.created_at).toLocaleTimeString()}</span>
      </div>
      <div className="flex items-center space-x-2">
        <DollarSign className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Total Amount:</span>
        <span>${orderStatus.order_amount.toFixed(2)}</span>
      </div>
      <div className="flex items-center space-x-2">
        <CreditCard className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Payment Method:</span>
        <span>{orderStatus.payment_method}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Info className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Payment Status:</span>
        <Badge
          variant={
            orderStatus.payment_status === "paid" ? "success" : "destructive"
          }
          className="ml-2"
        >
          {orderStatus.payment_status}
        </Badge>
      </div>
    </div>
  </div>
);
