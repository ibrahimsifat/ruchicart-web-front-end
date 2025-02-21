import { api } from "./api";

interface OrderData {
  id?: number;
  order_amount: number;
  payment_method: string;
  order_type: string;
  delivery_address_id?: number;
  branch_id?: number;
  delivery_time: string;
  delivery_date: string;
  distance: number;
  is_partial: boolean;
  cart: any[];
  guest_id?: number;
  change_amount?: string;
  stripe_payment_intent_id?: string;
}

export async function placeOrder(orderData: OrderData) {
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
