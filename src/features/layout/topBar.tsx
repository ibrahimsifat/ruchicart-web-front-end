"use client";

import { Button } from "@/components/ui/button";
import { LocationModal } from "@/features/location/location-modal";
import { useBranchStore } from "@/store/branchStore";
import { useLocationStore } from "@/store/locationStore";
import { GitBranch, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";

const TopBar = () => {
  const { currentLocation } = useLocationStore();
  const { currentBranch } = useBranchStore();
  const router = useRouter();
  const t = useTranslations("home");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [initialLocationCheck, setInitialLocationCheck] = useState(false);
  console.log(currentLocation);
  // Handle initial location check only once
  useEffect(() => {
    if (!initialLocationCheck && !currentLocation?.address) {
      const timeoutId = setTimeout(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            () => setShowLocationModal(true),
            () => setShowLocationModal(true)
          );
        } else {
          setShowLocationModal(true);
        }
        setInitialLocationCheck(true);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentLocation?.address, initialLocationCheck]);

  // Handle offline state and branch check
  useEffect(() => {
    const handleOffline = () => router.push("/no-internet");
    window.addEventListener("offline", handleOffline);

    if (!currentBranch) {
      router.push("/select-branch");
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, [currentBranch, router]);

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

  const handleBranchClick = useCallback(() => {
    router.push("/select-branch");
  }, [router]);

  const locationAddress = currentLocation?.address || "Select Location";
  const branchName = currentBranch?.name || "Select Branch";

  return (
    <nav className="w-full bg-primary/20 border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <LocationDisplay
          address={locationAddress}
          t={t}
          onClick={handleShowLocationModal}
        />

        <NavigationButtons
          t={t}
          onBranchClick={handleBranchClick}
          branchDisplay={branchName}
        />

        <LocationModal
          isOpen={showLocationModal}
          onClose={handleCloseLocationModal}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </nav>
  );
};

export default memo(TopBar);

// navigation buttons
const NavigationButtons = memo(
  ({
    t,
    onBranchClick,
    branchDisplay,
  }: {
    t: any;
    onBranchClick: () => void;
    branchDisplay: string;
  }) => (
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
        onClick={onBranchClick}
      >
        <GitBranch className="h-4 w-4 mr-2 text-primary-text" />
        {branchDisplay}
      </Button>
    </div>
  )
);

// location display
const LocationDisplay = memo(
  ({
    address,
    t,
    onClick,
  }: {
    address: string;
    t: any;
    onClick: () => void;
  }) => (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-primary-text" />
      <span>{t("deliverTo")}: </span>
      <Button
        variant="link"
        className="p-0 h-auto font-medium max-w-[200px] truncate"
        onClick={onClick}
      >
        {address}
      </Button>
    </div>
  )
);
