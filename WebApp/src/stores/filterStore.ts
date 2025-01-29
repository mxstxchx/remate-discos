import { create } from 'zustand';

interface FilterState {
  // Filter values
  selectedArtists: string[];
  selectedLabels: string[];
  selectedStyles: string[];
  selectedConditions: string[];
  priceRange: {
    min: number;
    max: number;
  };
  
  // Actions
  setArtists: (artists: string[]) => void;
  setLabels: (labels: string[]) => void;
  setStyles: (styles: string[]) => void;
  setConditions: (conditions: string[]) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  clearFilters: () => void;
}

const initialState = {
  selectedArtists: [],
  selectedLabels: [],
  selectedStyles: [],
  selectedConditions: [],
  priceRange: {
    min: 0,
    max: 100
  }
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setArtists: (artists) => set({ selectedArtists: artists }),
  setLabels: (labels) => set({ selectedLabels: labels }),
  setStyles: (styles) => set({ selectedStyles: styles }),
  setConditions: (conditions) => set({ selectedConditions: conditions }),
  setPriceRange: (range) => set({ priceRange: range }),
  
  clearFilters: () => set(initialState)
}));