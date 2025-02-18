import { Order } from "@/types/order";
import { Clock, MapPin, Store } from "lucide-react";

export const BranchInfo = ({ orderStatus }: { orderStatus: Order }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-xl">Branch Information</h3>
    <div className="bg-white rounded-lg p-6 duration-300">
      <div className="flex items-center space-x-2 mb-2">
        <Store className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Branch:</span>
        <span>{orderStatus.branch.name}</span>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <MapPin className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Branch Address:</span>
        <span>{orderStatus.branch.address}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-primary-text" />
        <span className="font-semibold">Preparation Time:</span>
        <span>{orderStatus.branch.preparation_time} minutes</span>
      </div>
    </div>
  </div>
);
