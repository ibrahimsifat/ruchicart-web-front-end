"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LocationModal } from "@/features/location/location-modal";
import { MapPin, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EnableLocationPage() {
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setIsLocationEnabled(true),
        () => setIsLocationEnabled(false)
      );
    } else {
      setIsLocationEnabled(false);
    }
  }, []);

  const handleEnableLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Geolocation successful, but we'll let LocationModal handle setting the location
          setShowLocationModal(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocationEnabled(false);
          setShowLocationModal(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setShowLocationModal(true);
    }
  };

  const handleLocationSelect = () => {
    setShowLocationModal(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <MapPin className="mx-auto h-16 w-16 text-primary-text mb-4" />
          <CardTitle className="text-2xl font-bold">
            Enable Location Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            To provide you with the best experience and accurate delivery
            options, we need access to your location. Please enable location
            services for this site.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleEnableLocation} className="w-full">
            Enable Location
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowLocationModal(true)}
            className="w-full"
          >
            <Settings className="mr-2 h-4 w-4" />
            Set Location Manually
          </Button>
        </CardFooter>
      </Card>

      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
