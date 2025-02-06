"use client";

import { Button } from "@/components/ui/button";
import { BranchSelector } from "@/features/branch/branchSelector";
import { LocationModal } from "@/features/location/location-modal";
import { useBranchStore } from "@/store/branchStore";
import { useLocationStore } from "@/store/locationStore";
import { GitBranch, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar() {
  const { currentLocation, setCurrentLocation } = useLocationStore();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const { currentBranch } = useBranchStore();

  useEffect(() => {
    // need to wait here for 1 second to get the location
    const timeout = setTimeout(() => {
      if (!currentLocation?.lat) {
        setShowLocationModal(true);
      }
    }, 2000);

    return () => clearTimeout(timeout);
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
          <Button
            variant="link"
            className="p-0 h-auto font-medium"
            onClick={() => setShowBranchSelector(true)}
          >
            <GitBranch className="h-4 w-4 mr-2 text-primary" />
            {currentBranch ? currentBranch.name : "Select Branch"}
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
        <BranchSelector
          isOpen={showBranchSelector}
          onClose={() => setShowBranchSelector(false)}
        />
      </div>
    </div>
  );
}
