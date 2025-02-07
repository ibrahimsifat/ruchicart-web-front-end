"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LocationSelector } from "@/features/location/locationSelector";
import { useBranchStore } from "@/store/branchStore";
import { useLocationStore } from "@/store/locationStore";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

export function LocationModal({
  isOpen,
  onClose,
  onLocationSelect,
}: LocationModalProps) {
  const { currentLocation } = useLocationStore();
  const { currentBranch } = useBranchStore();
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const t = useTranslations("location");
  const handleLocationSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    onLocationSelect(location);
    if (!currentBranch) {
      setShowBranchSelector(true);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {currentLocation ? t("changeLocation") : t("selectYourLocation")}
          </DialogTitle>
        </DialogHeader>
        <LocationSelector
          onSelectLocation={handleLocationSelect}
          initialLocation={currentLocation}
        />
      </DialogContent>
    </Dialog>
  );
}
