"use client";

import { Button } from "@/components/ui/button";
import { LocationModal } from "@/features/location/location-modal";
import { useRouter } from "@/i18n/routing";
import { useBranchStore } from "@/store/branchStore";
import { useLocationStore } from "@/store/locationStore";
import { GitBranch, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const TopBar = () => {
  const { currentLocation } = useLocationStore();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { currentBranch } = useBranchStore();
  const router = useRouter();
  const t = useTranslations("home");

  useEffect(() => {
    // wait for 1 second before checking if currentLocation is set
    const timeout = setTimeout(() => {
      if (!currentLocation && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => setShowLocationModal(true),
          (error) => {
            console.error("Error getting location:", error);
            setShowLocationModal(true);
          }
        );
      } else if (!currentLocation) {
        setShowLocationModal(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [currentLocation, router]);

  useEffect(() => {
    const handleOffline = () => router.push("/no-internet");
    window.addEventListener("offline", handleOffline);
    return () => window.removeEventListener("offline", handleOffline);
  }, [router]);

  console.log(currentBranch);
  // if currentBranch is not set, redirect to select-branch page
  useEffect(() => {
    if (!currentBranch) {
      router.push("/select-branch");
    }
  }, [currentBranch, router]);

  const handleLocationSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    setShowLocationModal(false);
  };

  return (
    <nav className="w-full bg-primary/5 border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{t("deliverTo")}: </span>
          <Button
            variant="link"
            className="p-0 h-auto font-medium max-w-[200px] truncate"
            onClick={() => setShowLocationModal(true)}
          >
            {currentLocation?.address || "Select Location"}
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
            <GitBranch className="h-4 w-4 mr-2 text-primary" />
            {currentBranch ? currentBranch.name : "Select Branch"}
          </Button>
        </div>

        <LocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </nav>
  );
};

export default TopBar;
