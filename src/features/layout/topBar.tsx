"use client";

import { Button } from "@/components/ui/button";
import { LocationModal } from "@/features/location/location-modal";
import { useBranchStore } from "@/store/branchStore";
import { useLocationStore } from "@/store/locationStore";
import { GitBranch, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const TopBar = () => {
  const { currentLocation } = useLocationStore();
  const { currentBranch } = useBranchStore();
  const router = useRouter();
  const t = useTranslations("home");
  const [showLocationModal, setShowLocationModal] = useState(false);
  console.log(currentLocation);

  // location check logic
  const checkAndRequestLocation = useCallback(() => {
    if (!currentLocation?.address && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setShowLocationModal(true),
        () => setShowLocationModal(true)
      );
    } else if (!currentLocation?.address) {
      setShowLocationModal(true);
    }
  }, [currentLocation]);

  // Combine initialization effects
  useEffect(() => {
    const timeout = setTimeout(checkAndRequestLocation, 1000);

    const handleOffline = () => router.push("/no-internet");
    window.addEventListener("offline", handleOffline);

    if (!currentBranch) {
      router.push("/select-branch");
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // location display
  const locationDisplay = useMemo(() => {
    return currentLocation?.address || "Select Location";
  }, [currentLocation?.address]);

  // branch display
  const branchDisplay = useMemo(() => {
    return currentBranch ? currentBranch.name : "Select Branch";
  }, [currentBranch?.name]);

  const handleLocationSelect = useCallback(
    (location: { address: string; lat: number; lng: number }) => {
      setShowLocationModal(false);
    },
    []
  );

  const handleShowLocationModal = useCallback(() => {
    setShowLocationModal(true);
  }, []);

  const handleCloseLocationModal = useCallback(() => {
    setShowLocationModal(false);
  }, []);

  return (
    <nav className="w-full bg-primary/20 border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary-text" />
          <span>{t("deliverTo")}: </span>
          <Button
            variant="link"
            className="p-0 h-auto font-medium max-w-[200px] truncate"
            onClick={handleShowLocationModal}
          >
            {locationDisplay}
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm">
            {t("becomeAPartner")}
          </Button>
          <Button variant="ghost" size="sm">
            {t("downloadApp")}
          </Button>
          <Button
            variant="link"
            className="p-0 h-auto font-medium"
            onClick={() => router.push("/select-branch")}
          >
            <GitBranch className="h-4 w-4 mr-2 text-primary-text" />
            {branchDisplay}
          </Button>
        </div>

        <LocationModal
          isOpen={showLocationModal}
          onClose={handleCloseLocationModal}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </nav>
  );
};

export default TopBar;
