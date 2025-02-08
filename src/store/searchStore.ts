import { create } from "zustand";

interface SearchFilters {
  sortBy: string;
  priceRange: number[];
  categories: number[];
  cuisines: number[];
  rating: number;
  discount: boolean;
  isVeg: boolean;
}

interface SearchStore {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  filters: {
    sortBy: "relevance",
    priceRange: [0, 1000],
    categories: [],
    cuisines: [],
    rating: 0,
    discount: false,
    isVeg: false,
  },
  setFilters: (filters) => set({ filters }),
}));
