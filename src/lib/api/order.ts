import { useAuthStore } from "@/store/authStore";
import { api } from "./api";

interface OrderData {
  order_amount: number;
  payment_method: string;
  order_type: string;
  delivery_address_id: string;
  branch_id: string;
  delivery_time: string;
  delivery_date: string;
  distance: number;
  is_partial: boolean;
  cart: any[];
  guest_id?: string;
}

export async function placeOrder(orderData: OrderData) {
  try {
    const response = await api.post(`/customer/order/place`, orderData);

    if (response.status !== 200) {
      throw new Error("Failed to place order");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

interface TrackOrderData {
  order_id: string;
  phone?: string;
}

export async function ordertrak({ order_id, phone }: TrackOrderData) {
  try {
    const response = await api.post("/customer/order/track", {
      order_id,
      phone: useAuthStore.getState().token ? undefined : phone,
    });

    if (response.status !== 200) {
      throw new Error("Failed to track order");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

interface OrderDetailsParams {
  order_id: string;
  phone?: string;
}

export async function getOrderDetails({ order_id, phone }: OrderDetailsParams) {
  try {
    const response = await api.get(`/customer/order/details`, {
      params: {
        order_id,
        phone: useAuthStore.getState().token ? undefined : phone,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch order details");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOrderHistory() {
  try {
    const response = await api.get("/customer/order/history");

    if (response.status !== 200) {
      throw new Error("Failed to fetch order history");
    }

    return response.data;
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
