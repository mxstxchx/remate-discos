import { createClient } from '@supabase/supabase-js';
import { Release } from '@/types';

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FilterOptions {
  artists?: string[];
  labels?: string[];
  styles?: string[];
  conditions?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export async function fetchReleases(filters: FilterOptions) {
  try {
    let query = supabase.from('releases').select('*');

    // Step 1: Apply label filter using the custom function if labels are selected
    if (filters.labels && filters.labels.length > 0) {
      const { data: labelFilteredIds } = await supabase
        .rpc('matches_any_label', {
          p_labels: filters.labels
        });

      if (labelFilteredIds) {
        query = query.in('id', labelFilteredIds.map(row => row.release_id));
      }
    }

    // Step 2: Apply remaining filters
    // Filter by artists
    if (filters.artists?.length) {
      query = query.contains('artists', filters.artists);
    }

    // Filter by styles
    if (filters.styles?.length) {
      query = query.contains('styles', filters.styles);
    }

    // Filter by condition
    if (filters.conditions?.length) {
      query = query.in('condition', filters.conditions);
    }

    // Filter by price range
    if (filters.priceRange) {
      query = query
        .gte('price', filters.priceRange.min)
        .lte('price', filters.priceRange.max);
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching releases:', error);
    return { data: null, error };
  }
}

export async function fetchFilterOptions() {
  try {
    const { data: releases, error } = await supabase
      .from('releases')
      .select('artists, labels, styles, price');

    if (error) {
      throw error;
    }

    // Process the data to get unique options with counts
    const options = releases.reduce(
      (acc, release) => {
        // Process artists
        release.artists.forEach((artist: string) => {
          acc.artists.set(artist, (acc.artists.get(artist) || 0) + 1);
        });

        // Process labels
        release.labels.forEach((label: { name: string }) => {
          acc.labels.set(label.name, (acc.labels.get(label.name) || 0) + 1);
        });

        // Process styles
        release.styles.forEach((style: string) => {
          acc.styles.set(style, (acc.styles.get(style) || 0) + 1);
        });

        return acc;
      },
      {
        artists: new Map<string, number>(),
        labels: new Map<string, number>(),
        styles: new Map<string, number>()
      }
    );

    // Convert maps to arrays of objects
    return {
      data: {
        artists: Array.from(options.artists.entries()).map(([value, count]) => ({ value, count })),
        labels: Array.from(options.labels.entries()).map(([value, count]) => ({ value, count })),
        styles: Array.from(options.styles.entries()).map(([value, count]) => ({ value, count }))
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return { data: null, error };
  }
}

export async function getPriceRange() {
  try {
    const { data, error } = await supabase
      .from('releases')
      .select('price')
      .order('price', { ascending: true });

    if (error) {
      throw error;
    }

    const prices = data.map(r => r.price);
    return {
      data: {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices))
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { data: null, error };
  }
}