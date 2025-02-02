"use client";

import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/features/checkout/checkout-form";
import { OrderSummary } from "@/features/checkout/order-summary";
import { LocationModal } from "@/features/location/location-modal";
import { useCart } from "@/store/cart";
import { useLocationStore } from "@/store/locationStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, itemCount } = useCart();
  const { currentLocation, savedLocations, addSavedLocation } =
    useLocationStore();
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    if (!currentLocation) {
      setShowLocationModal(true);
    }
  }, [currentLocation]);

  // Redirect if cart is empty
  if (itemCount === 0) {
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

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm />
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
