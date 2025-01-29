import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFilterStore } from '@/stores/filterStore';
import { fetchReleases } from '@/lib/queries/releaseQueries';
import { Release } from '@/types';
import { AlertTriangle } from 'lucide-react';

export function ReleaseGrid() {
  const [releases, setReleases] = React.useState<Release[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const filters = useFilterStore();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await fetchReleases({
          artists: filters.selectedArtists,
          labels: filters.selectedLabels,
          styles: filters.selectedStyles,
          conditions: filters.selectedConditions,
          priceRange: filters.priceRange
        });

        if (error) throw error;
        if (data) setReleases(data);
      } catch (e) {
        setError('Failed to load releases. Please try again later.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (releases.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No releases found matching your filters. Try adjusting your search criteria.
        </AlertDescription>
      </Alert>
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}