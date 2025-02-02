import { api } from "./api";

export const getAutocompletePlace = async (searchKey: string) => {
  const { data } = await api.get(
    `/mapapi/place-api-autocomplete?search_text=${searchKey}`
  );
  return data;
};

export const getDistance = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) => {
  const { data } = await api.get(
    `/mapapi/distance-api?origin_lat=${origin.lat}&origin_lng=${origin.lng}&destination_lat=${destination.lat}&destination_lng=${destination.lng}`
  );
  return data;
};

export const getPlaceDetails = async (placeId: string) => {
  const { data } = await api.get(
    `/mapapi/place-api-details?placeid=${placeId}`
  );
  return data;
};

export const getGeocode = async (location: { lat: number; lng: number }) => {
  const { data } = await api.get(
    `/mapapi/geocode-api?lat=${location.lat}&lng=${location.lng}`
  );
  return data;
};
