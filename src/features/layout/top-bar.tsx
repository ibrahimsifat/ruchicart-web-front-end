"use client";

import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationStore {
  address: string | null;
  coordinates: { lat: number; lng: number } | null;
  setLocation: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

const useLocation = create<LocationStore>()(
  persist(
    (set) => ({
      address: null,
      coordinates: null,
      setLocation: (location) =>
        set({
          address: location.address,
          coordinates: { lat: location.lat, lng: location.lng },
        }),
    }),
    {
      name: "food-delivery-location",
    }
  )
);

export function TopBar() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { address, setLocation } = useLocation();

  useEffect(() => {
    if (!address) {
      setShowLocationModal(true);
    }
  }, [address]);

  return (
    <div className="w-full bg-primary/5 border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Deliver to: </span>
          <Button
            variant="link"
            className="p-0 h-auto font-medium max-w-[200px] truncate"
            onClick={() => setShowLocationModal(true)}
          >
            {address || "Select Location"}
          </Button>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Become a Partner
          </Button>
          <Button variant="ghost" size="sm">
            Download App
          </Button>
        </div>

        {/* <LocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onLocationSelect={(location) => {
            setLocation(location)
            setShowLocationModal(false)
          }}
        /> */}
      </div>
    </div>
  );
}
