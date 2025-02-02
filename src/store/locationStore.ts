import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface LocationState {
  currentLocation: Location | null;
  savedLocations: Location[];
  setCurrentLocation: (location: Location) => void;
  addSavedLocation: (location: Location) => void;
  removeSavedLocation: (index: number) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentLocation: null,
      savedLocations: [],
      setCurrentLocation: (location) => set({ currentLocation: location }),
      addSavedLocation: (location) =>
        set((state) => ({
          savedLocations: [...state.savedLocations, location],
        })),
      removeSavedLocation: (index) =>
        set((state) => ({
          savedLocations: state.savedLocations.filter((_, i) => i !== index),
        })),
    }),
    {
      name: "location-storage",
    }
  )
);
