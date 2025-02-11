"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomImage from "@/components/ui/customImage";
import { useGoogleMaps } from "@/lib/provider/google-maps-provider";
import { BaseBranch } from "@/types/branch";
import { ImageType } from "@/types/image";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { CONSTANT } from "../../../config/constants";

interface BranchMapProps {
  branches: BaseBranch[];
  selectedBranch: BaseBranch | null;
  onBranchSelect: (branch: BaseBranch) => void;
  currentLocation: { lat: number; lng: number } | null;
}

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export function BranchMap({
  branches,
  selectedBranch,
  onBranchSelect,
  currentLocation,
}: BranchMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (map && branches.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      if (currentLocation) {
        bounds.extend(currentLocation);
      }

      branches.forEach((branch) => {
        bounds.extend({
          lat: Number(branch.latitude),
          lng: Number(branch.longitude),
        });
      });

      map.fitBounds(bounds, 50);
    }
  }, [map, branches, currentLocation]);

  useEffect(() => {
    if (selectedBranch && map) {
      map.panTo({
        lat: Number(selectedBranch.latitude),
        lng: Number(selectedBranch.longitude),
      });
      map.setZoom(15);
    }
  }, [selectedBranch, map]);

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="h-full w-full"
      center={currentLocation || { lat: 0, lng: 0 }}
      zoom={12}
      options={mapOptions}
      onLoad={setMap}
    >
      {currentLocation && (
        <Marker
          position={currentLocation}
          icon={{
            url: CONSTANT.images.userLocationPic,
            scaledSize: new google.maps.Size(30, 30),
          }}
        />
      )}

      {branches.map((branch) => (
        <Marker
          key={branch.id}
          position={{
            lat: Number(branch.latitude),
            lng: Number(branch.longitude),
          }}
          onClick={() => onBranchSelect(branch)}
          icon={{
            url:
              branch.id === selectedBranch?.id
                ? CONSTANT.images.userLocationPic
                : CONSTANT.images.userLocationPic,
            scaledSize: new google.maps.Size(40, 40),
          }}
        />
      ))}

      {selectedBranch && (
        <InfoWindow
          position={{
            lat: Number(selectedBranch.latitude),
            lng: Number(selectedBranch.longitude),
          }}
        >
          <Card className="min-w-[200px] overflow-hidden p-0">
            <div className="relative h-28">
              <CustomImage
                type={ImageType.BRANCH}
                src={selectedBranch.image || "/placeholder.svg"}
                alt={selectedBranch.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="text-lg font-semibold text-white">
                  {selectedBranch.name}
                </h3>
              </div>
            </div>
            <div className="space-y-2 p-3">
              <p className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {selectedBranch.address}
              </p>
              <div className="flex items-center justify-between">
                {/* <span className="text-sm text-muted-foreground">
                   Time:
                </span>
                <Badge
                  variant={
                    selectedBranch.preparation_time ? "success" : "secondary"
                  }
                >
                  {selectedBranch.preparation_time}
                </Badge> */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  {selectedBranch.distance} km Away
                </div>
              </div>
              <Button
                className="mt-2 w-full"
                onClick={() => onBranchSelect(selectedBranch)}
              >
                Select Branch
              </Button>
            </div>
          </Card>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
