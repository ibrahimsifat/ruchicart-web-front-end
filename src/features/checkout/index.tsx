"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckoutForm } from "@/features/checkout/checkout-form";
import { OrderSummary } from "@/features/checkout/order-summary";
import { LocationModal } from "@/features/location/location-modal";
import { api } from "@/lib/api/api";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/store/cart";
import { useLocationStore } from "@/store/locationStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, itemCount, clearCart } = useCart();
  const { currentLocation, savedLocations, addSavedLocation } =
    useLocationStore();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { toast } = useToast();
  const { user, token } = useAuthStore();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentLocation) {
      setShowLocationModal(true);
    }
  }, [currentLocation]);

  // Redirect if cart is empty
  if (itemCount === 0 && !orderPlaced) {
    router.push("/");
    return null;
  }

  const handleAddNewAddress = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    addSavedLocation(location);
    setShowLocationModal(false);
  };

  const handlePlaceOrder = async (values: any) => {
    setPlacingOrder(true);

    const orderData = {
      order_amount: total,
      payment_method: values.paymentMethod,
      order_type: values.deliveryOption,
      delivery_address_id: values.address,
      branch_id: values.branch,
      delivery_time: "now", // Replace with actual delivery time
      delivery_date: new Date().toISOString().slice(0, 10), // Replace with actual delivery date
      distance: 0, // Replace with actual distance
      guest_id: !user ? "guest_id" : undefined, // Replace with actual guest ID if available
      is_partial: 0, // Replace with 1 if partial payment
      cart: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        variant: item.variation,
        variations: [], // Replace with actual variations if needed
        add_on_ids: [], // Replace with actual add-on IDs if needed
        add_on_qtys: [], // Replace with actual add-on quantities if needed
      })),
      coupon_discount_amount: 0, // Replace with actual discount amount
      coupon_discount_title: null, // Replace with actual discount title
      coupon_code: null, // Replace with actual coupon code
      order_note: values.orderNote, // Add order note
      is_cutlery_required: values.cutlery, // Add cutlery option
      selected_delivery_area: values.deliveryArea, // Add delivery area
    };

    try {
      const response = await api.post("/order/place", orderData);
      setOrderId(response.data.order_id);
      setOrderPlaced(true);
      clearCart();
      toast({
        title: "Order Placed!",
        description: `Your order (ID: ${response.data.order_id}) has been placed successfully.`,
      });
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Thank you for your order!</h2>
          <p className="text-lg mb-8">Your order ID is: {orderId}</p>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm
              onPlaceOrder={handlePlaceOrder}
              placingOrder={placingOrder}
            />
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Delivery Addresses</h3>
              {savedLocations.map((location, index) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  {location.address}
                </div>
              ))}
              <Button onClick={() => setShowLocationModal(true)}>
                Add New Address
              </Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </main>

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleAddNewAddress}
      />
    </>
  );
}
