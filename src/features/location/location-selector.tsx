"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useGoogleMaps } from "@/lib/provider/google-maps-provider";
import { useLocationStore } from "@/store/locationStore";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin, Navigation, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapStatus } from "./mapStatus";

// Default center (Bangladesh)
const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  mapTypeControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

interface LocationSelectorProps {
  onSelectLocation: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  initialLocation?: { address: string; lat: number; lng: number } | null;
}

export function LocationSelector({
  onSelectLocation,
  initialLocation,
}: LocationSelectorProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const t = useTranslations("location");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.LatLngLiteral | null>(
      initialLocation
        ? { lat: initialLocation.lat, lng: initialLocation.lng }
        : null
    );

  const { setCurrentLocation } = useLocationStore();
  const { toast } = useToast();
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Initialize values from initialLocatio
  useEffect(() => {
    if (initialLocation) {
      setSearchQuery(initialLocation.address || "");
      setSelectedAddress(initialLocation.address || "");
      setSelectedLocation({
        lat: initialLocation.lat,
        lng: initialLocation.lng,
      });
    }
  }, [initialLocation]);
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const handleSearch = useCallback(
    async (input: string) => {
      setSearchQuery(input);
      if (!input || !autocompleteService.current) {
        setPredictions([]);
        setShowPredictions(false);
        return;
      }

      try {
        const response = await autocompleteService.current.getPlacePredictions({
          input,
          componentRestrictions: { country: "BD" }, // Restrict to Bangladesh
        });
        setPredictions(response.predictions);
        setShowPredictions(true);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictions([]);
      }
    },
    [autocompleteService]
  );

  const handlePredictionSelect = useCallback(
    async (prediction: google.maps.places.AutocompletePrediction) => {
      if (!map || !window.google) return;

      // Create PlacesService if it doesn't exist
      if (!placesService.current) {
        placesService.current = new window.google.maps.places.PlacesService(
          map
        );
      }

      try {
        placesService.current.getDetails(
          {
            placeId: prediction.place_id,
            fields: ["geometry", "formatted_address"],
          },
          (place, status) => {
            if (status === "OK" && place?.geometry?.location) {
              const newLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              };
              setSelectedLocation(newLocation);
              setSelectedAddress(
                place.formatted_address || prediction.description
              );
              map.setCenter(newLocation);
              map.setZoom(17);
              setShowPredictions(false);
              setSearchQuery(prediction.description);
            }
          }
        );
      } catch (error) {
        console.error("Error fetching place details:", error);
        toast({
          title: "Error",
          description: "Failed to get location details. Please try again.",
          variant: "destructive",
        });
      }
    },
    [map, toast]
  );

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setSelectedLocation(newLocation);

        // Get address for clicked location
        if (window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: newLocation }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              setSelectedAddress(results[0].formatted_address);
              setSearchQuery(results[0].formatted_address);
            }
          });
        }

        if (map) {
          map.setZoom(17);
          map.panTo(newLocation);
        }
      }
    },
    [map]
  );

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    toast({
      title: "Getting location",
      description: "Please wait while we get your current location...",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setSelectedLocation(pos);

        // Get address for current location
        if (window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              setSelectedAddress(results[0].formatted_address);
              setSearchQuery(results[0].formatted_address);
            }
          });
        }

        if (map) {
          map.setCenter(pos);
          map.setZoom(17);
        }
        setIsGettingLocation(false);
        toast({
          title: "Location found",
          description:
            "Your current location has been found. Please confirm to proceed.",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Error",
          description:
            "Failed to get your current location. Please try selecting manually.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [map, toast]);

  const handleConfirmLocation = useCallback(() => {
    if (!selectedLocation || !selectedAddress) return;

    const location = {
      address: selectedAddress,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    };
    setCurrentLocation(location);
    onSelectLocation(location);
    toast({
      title: "Location confirmed",
      description: `Selected: ${selectedAddress}`,
    });
  }, [
    selectedLocation,
    selectedAddress,
    setCurrentLocation,
    onSelectLocation,
    toast,
  ]);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      if (initialLocation) {
        map.setCenter({ lat: initialLocation.lat, lng: initialLocation.lng });
        map.setZoom(17);
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(6);
      }
    },
    [initialLocation]
  );

  useEffect(() => {
    if (map) {
      if (initialLocation) {
        map.setCenter({ lat: initialLocation.lat, lng: initialLocation.lng });
        map.setZoom(17);
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(6);
      }
    }
  }, [map, initialLocation]);

  useEffect(() => {
    if (initialLocation && map) {
      setSelectedLocation({
        lat: initialLocation.lat,
        lng: initialLocation.lng,
      });
      setSelectedAddress(initialLocation.address);
      setSearchQuery(initialLocation.address);
      map.setCenter({ lat: initialLocation.lat, lng: initialLocation.lng });
      map.setZoom(17);
    }
  }, [initialLocation, map]);

  if (loadError) {
    return (
      <MapStatus
        type="error"
        message="Failed to load Google Maps. Please check your internet connection and try again."
      />
    );
  }

  if (!isLoaded) {
    return <MapStatus type="loading" />;
  }

  return (
    <div className="h-[500px] w-full relative">
      {/* Search Box */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for a location"
            className="pl-9 pr-4 py-2 w-full shadow-lg"
          />

          {/* Search Predictions */}
          {showPredictions && predictions.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto shadow-lg z-50">
              <div className="p-1">
                {predictions.map((prediction) => (
                  <Button
                    key={prediction.place_id}
                    variant="ghost"
                    className="w-full justify-start text-left px-3 py-2 h-auto"
                    onClick={() => handlePredictionSelect(prediction)}
                  >
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{prediction.description}</span>
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={6}
        center={defaultCenter}
        onLoad={onMapLoad}
        onClick={handleMapClick}
        options={mapOptions}
      >
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            animation={window.google?.maps.Animation.DROP}
          />
        )}
      </GoogleMap>

      {/* Location Preview */}
      {selectedLocation && selectedAddress && (
        <Card className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md mx-4 bg-white/95 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <Navigation className="h-5 w-5 text-primary-text mt-1" />
              <div className="flex-1">
                <h3 className="font-medium mb-1">{t("selectedLocation")}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4 flex gap-2">
        <Button
          onClick={getCurrentLocation}
          className="flex-1 bg-white text-primary-text hover:bg-white/90"
          variant="outline"
          disabled={isGettingLocation}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {isGettingLocation ? t("gettingLocation") : t("useCurrentLocation")}
        </Button>
        <Button
          onClick={handleConfirmLocation}
          className="flex-1"
          disabled={!selectedLocation || !selectedAddress || isGettingLocation}
        >
          {t("confirmLocation")}
        </Button>
      </div>
    </div>
  );
}
