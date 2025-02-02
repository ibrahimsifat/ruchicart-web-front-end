import {
  getAutocompletePlace,
  getDistance,
  getGeocode,
  getPlaceDetails,
} from "@/lib/api/location";
import { useLocationStore } from "@/store/locationStore";
import { useQuery } from "@tanstack/react-query";
export const useAutocompletePlace = (searchKey: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["places", searchKey],
    queryFn: () => getAutocompletePlace(searchKey),
    enabled: enabled && !!searchKey,
  });
};

export const useGetDistance = (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) => {
  return useQuery({
    queryKey: ["distance", origin, destination],
    queryFn: () => getDistance(origin, destination),
    enabled: false,
  });
};

export const useGetPlaceDetails = (placeId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["placeDetails", placeId],
    queryFn: () => getPlaceDetails(placeId),
    enabled: enabled && !!placeId,
  });
};

export const useGetGeocode = (
  location: { lat: number; lng: number },
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["geocode", location],
    queryFn: () => getGeocode(location),
    enabled: enabled && !!location.lat && !!location.lng,
  });
};

export const useSetLocation = () => {
  const setLocation = useLocationStore((state) => state.setLocation);

  return {
    mutate: (location: { address: string; lat: number; lng: number }) => {
      setLocation(location);
      return Promise.resolve(location);
    },
  };
};
