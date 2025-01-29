import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useFilterStore } from '@/stores/filterStore';

interface Release {
  id: number;
  title: string;
  artists: string[];
  labels: {
    name: string;
    catno: string;
  }[];
  condition: string;
  price: number;
  primary_image: string;
}

export function ReleaseGrid() {
  const [releases, setReleases] = React.useState<Release[]>([]);
  const [loading, setLoading] = React.useState(true);
  const filters = useFilterStore();

  React.useEffect(() => {
    const fetchReleases = async () => {
      setLoading(true);
      try {
        // TODO: Implement Supabase query using matches_any_label function
        // const { data, error } = await supabase.rpc('matches_any_label', {
        //   p_labels: filters.selectedLabels
        // })
        
        // For now, simulate data
        setReleases([]);
      } catch (error) {
        console.error('Error fetching releases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [filters]); // Re-fetch when filters change

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-muted" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {releases.map((release) => (
        <Card key={release.id} className="overflow-hidden">
          {/* Album Cover */}
          <div className="aspect-square relative">
            <img
              src={release.primary_image || '/placeholder.jpg'}
              alt={release.title}
              className="object-cover w-full h-full"
            />
          </div>
          
          {/* Release Info */}
          <CardContent className="p-4">
            <h3 className="font-medium truncate">{release.title}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {release.artists.join(', ')}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs bg-accent px-2 py-1 rounded">
                {release.condition}
              </span>
              {release.labels[0] && (
                <span className="text-xs text-muted-foreground">
                  {release.labels[0].name} - {release.labels[0].catno}
                </span>
              )}
            </div>
          </CardContent>
          
          {/* Price */}
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <span className="font-medium">€{release.price}</span>
            {/* Additional controls can go here */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}