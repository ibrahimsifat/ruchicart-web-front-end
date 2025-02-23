import { LocationSelector } from "../location/location-selector";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocationStore } from "@/store/locationStore";
import { memo } from "react";

export const LocationDialog = memo(
  ({
    open,
    onOpenChange,
    onSelectLocation,
    t,
  }: {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    onSelectLocation: (location: {
      address: string;
      lat: number;
      lng: number;
    }) => void;
    t: any;
  }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{t("selectLocation")}</DialogTitle>
        </DialogHeader>
        <LocationSelector
          onSelectLocation={onSelectLocation}
          initialLocation={useLocationStore().currentLocation}
        />
      </DialogContent>
    </Dialog>
  )
);
