export interface Release {
  id: number;
  title: string;
  artists: string[];
  labels: {
    name: string;
    catno: string;
  }[];
  styles: string[];
  year: string;
  country: string;
  notes: string;
  condition: string;
  price: number;
  primary_image: string;
  secondary_image: string;
  videos: {
    url: string;
    title: string;
  }[];
  needs_audio: boolean;
  tracklist: {
    position: string;
    title: string;
    duration: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface FilterOption {
  value: string;
  count?: number;
}

export interface FilterState {
  selectedArtists: string[];
  selectedLabels: string[];
  selectedStyles: string[];
  selectedConditions: string[];
  priceRange: {
    min: number;
    max: number;
  };
  setArtists: (artists: string[]) => void;
  setLabels: (labels: string[]) => void;
  setStyles: (styles: string[]) => void;
  setConditions: (conditions: string[]) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  clearFilters: () => void;
}

export interface FilterOptions {
  artists?: FilterOption[];
  labels?: FilterOption[];
  styles?: FilterOption[];
}