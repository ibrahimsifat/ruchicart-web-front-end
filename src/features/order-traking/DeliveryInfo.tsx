import { formatTime } from "@/lib/utils/date";
import { Order } from "@/types/order";
import { Calendar, Clock, MapPin, Truck } from "lucide-react";

export const DeliveryInfo = ({
  orderAddress,
  orderStatus,
}: {
  orderAddress?: string;
  orderStatus: Order;
}) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-xl">Delivery Information</h3>
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Address:</span>
        <span>{orderAddress || "Not available"}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Delivery Date:</span>
        <span>{orderStatus.delivery_date}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Delivery Time:</span>
        <span>{formatTime(orderStatus.delivery_time)}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Truck className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Delivery Charge:</span>
        <span>${orderStatus.delivery_charge}</span>
      </div>
    </div>
  </div>
);
