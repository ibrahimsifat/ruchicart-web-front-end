"use client";

import { Button } from "@/components/ui/button";
import { LocationModal } from "@/features/location/location-modal";
import { useLocationStore } from "@/store/locationStore";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { currentLocation, setCurrentLocation } = useLocationStore();

  useEffect(() => {
    if (!currentLocation) {
      setShowLocationModal(true);
    }
  }, [currentLocation]);

  const handleOpenLocationModal = () => {
    setShowLocationModal(true);
  };

  return (
    <div className="w-full bg-primary/5 border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Deliver to: </span>
          <Button
            variant="link"
            className="p-0 h-auto font-medium max-w-[200px] truncate"
            onClick={handleOpenLocationModal}
          >
            {currentLocation?.address || "Select Location"}
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

        <LocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onLocationSelect={(location) => {
            setCurrentLocation(location);
            setShowLocationModal(false);
          }}
        />
      </div>
    </div>
  );
}
