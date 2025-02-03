"use client";

import { useToast } from "@/components/ui/use-toast";
import { CheckoutForm } from "@/features/checkout/checkout-form";
import { OrderSummary } from "@/features/checkout/order-summary";
import { useAddressList } from "@/lib/hooks/queries/address/useAddress";
import { useAddressStore } from "@/store/addressStore";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/store/cart";
import { useLocationStore } from "@/store/locationStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { items, total, itemCount, clearCart } = useCart();
  const { currentLocation, savedLocations, addSavedLocation } =
    useLocationStore();
  const [deliveryTip, setDeliveryTip] = useState(0);
  const { token, getGuestId } = useAuthStore();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: addresses,
    isLoading: addressesLoading,
    error: addressesError,
  } = useAddressList();
  const { setAddresses } = useAddressStore();

  useEffect(() => {
    if (itemCount === 0) {
      router.push("/");
    }
  }, [itemCount, router]);

  useEffect(() => {
    if (addresses) {
      setAddresses(addresses);
    }
  }, [addresses, setAddresses]);

  const handleAddNewAddress = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    addSavedLocation(location);
    setShowLocationModal(false);
  };

  const handlePlaceOrder = async (orderData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/order/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderData,
          cart: items,
          guest_id: !token ? getGuestId() : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const data = await response.json();
      clearCart();
      router.push(`/order-confirmation/${data.order_id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (addressesLoading) {
    return <div>Loading addresses...</div>;
  }

  if (addressesError) {
    return <div>Error loading addresses: {addressesError.message}</div>;
  }

  if (itemCount === 0) {
    return null;
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm
              onSubmit={handlePlaceOrder}
              isLoading={isLoading}
              deliveryTip={deliveryTip}
              setDeliveryTip={setDeliveryTip}
            />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              total={total}
              deliveryTip={deliveryTip}
            />
          </div>
        </div>
      </main>
    </>
  );
}
