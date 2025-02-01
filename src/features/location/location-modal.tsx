"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, lng } = position.coords;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.results?.[0]) {
            onLocationSelect({
              address: data.results[0].formatted_address,
              lat: latitude,
              lng: position.coords.longitude,
            });
            onClose();
          }
        } catch (error) {
          setError("Failed to get your location. Please select manually.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setError("Failed to get your location. Please select manually.");
        setIsLoading(false);
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Pick Location</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Sharing your accurate location enhances precision in search results
            and delivery estimates, ensures effortless order delivery.
          </p>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              className="gap-2"
              onClick={getCurrentLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              Use Current Location
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
              }&q=${encodeURIComponent(searchQuery || "Dhaka, Bangladesh")}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <Button className="w-full" size="lg" onClick={onClose}>
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
