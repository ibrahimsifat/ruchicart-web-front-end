import { OrderPlaceHolderData } from "@/types/order";
import { api } from "./api";

export async function placeOrder(orderData: OrderPlaceHolderData) {
  try {
    if (orderData.payment_method === "cash_on_delivery") {
      orderData = { ...orderData, change_amount: orderData.change_amount };
    } else if (orderData.payment_method === "stripe") {
      orderData = {
        ...orderData,
        stripe_payment_intent_id: orderData.stripe_payment_intent_id,
      };
    }

    const response = await api.post(`/customer/order/place`, orderData);

    return response;
  } catch (error) {
    throw error;
  }
}

interface CancelOrderParams {
  order_id: string;
}

export async function cancelOrder({ order_id }: CancelOrderParams) {
  try {
    const response = await api.post("/customer/order/cancel", {
      order_id,
    });

    if (response.status !== 200) {
      throw new Error("Failed to cancel order");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}
