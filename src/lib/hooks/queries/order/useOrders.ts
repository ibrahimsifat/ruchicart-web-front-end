import { fetchData } from "@/lib/api/fetch-utils";
import { queryKeys } from "@/lib/api/queries";
import { OrderDetailsItem, TrackOrderItem } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
interface orderTrackOptions {
  order_id: string;
  guest_id: string;
}
async function getOrderDetails(order_id: string) {
  return fetchData<OrderDetailsItem[]>("/customer/order/details", {
    params: { order_id },
  });
}

export const useOrderDetails = (order_id: string) => {
  return useQuery<OrderDetailsItem[]>({
    queryKey: queryKeys.orders.details(order_id),
    queryFn: () => getOrderDetails(order_id),
  });
};

async function orderTrack(options: orderTrackOptions) {
  return fetchData<TrackOrderItem>("/customer/order/track", {
    params: options,
  });
}

export const useOrderTrack = (options: orderTrackOptions) => {
  return useQuery<TrackOrderItem>({
    queryKey: queryKeys.orders.track(options.order_id),
    queryFn: () => orderTrack(options),
  });
};
