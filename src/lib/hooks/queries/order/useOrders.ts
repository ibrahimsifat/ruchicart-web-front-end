import { toast } from "@/components/ui/use-toast";
import { fetchData } from "@/lib/api/fetchUtils";
import { getQueryClient, queryKeys } from "@/lib/api/queries";
import {
  OrderDetailsItem,
  OrderListResponse,
  TrackOrderItem,
} from "@/types/order";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export const getOrders = async ({
  limit,
  page,
}: {
  limit: number;
  page: number;
}) => {
  return fetchData<OrderListResponse>("/customer/order/list", {
    params: { limit, page },
  });
};

export const useOrders = ({ limit, page }: { limit: number; page: number }) => {
  return useQuery<OrderListResponse>({
    queryKey: queryKeys.orders.list,
    queryFn: () => getOrders({ limit, page }),
  });
};

const cancelOrder = async (order_id: string) => {
  return fetchData<OrderDetailsItem>("/customer/order/cancel", {
    params: { order_id },
  });
};

export const useCancelOrder = (order_id: string) => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: () => cancelOrder(order_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.details(order_id),
      });
      toast({
        title: "Order Canceled",
        description: "Your order has been successfully canceled.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// useQuery({
//     queryKey: ["orderStatus", orderId],
//     queryFn: async () => {
//       const response = await api.get("/customer/order/track", {
//         params: {
//           order_id: orderId,
//           guest_id: token ? undefined : getGuestId(),
//         },
//       });
//       return response.data;
//     },
//     enabled: false,
//   });
