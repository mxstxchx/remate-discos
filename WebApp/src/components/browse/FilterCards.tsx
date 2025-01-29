"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFilterStore } from '@/stores/filterStore';
import { FilterOption } from '@/types';
import { 
  Search, 
  AlertTriangle, 
  User2, 
  Disc, 
  Music, 
} from 'lucide-react';

interface FilterCardProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onSelect: (values: string[]) => void;
  loading?: boolean;
  error?: string | null;
  icon: React.ReactNode;
}

function FilterBadge({ 
  value, 
  count, 
  selected, 
  onClick 
}: { 
  value: string; 
  count?: number; 
  selected: boolean; 
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1 m-1 rounded-full cursor-pointer
        transition-colors text-sm
        ${selected 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary hover:bg-secondary/80'}
      `}
    >
      <span>{value}</span>
      {count !== undefined && (
        <span className="ml-2 opacity-70">({count})</span>
      )}
    </div>
  );
}

function FilterCard({ 
  title, 
  options, 
  selected, 
  onSelect,
  loading,
  error,
  icon
}: FilterCardProps) {
  const [search, setSearch] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState(selected);
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value: string) => {
    const newSelected = selectedItems.includes(value)
      ? selectedItems.filter(item => item !== value)
      : [...selectedItems, value];
    setSelectedItems(newSelected);
  };

  const handleApply = () => {
    onSelect(selectedItems);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 cursor-pointer hover:bg-accent flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-medium">{title}</span>
            </div>
            {selected.length > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                {selected.length}
              </span>
            )}
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh] mt-4">
            <div className="flex flex-wrap gap-1">
              {filteredOptions.map(option => (
                <FilterBadge
                  key={option.value}
                  value={option.value}
                  count={option.count}
                  selected={selectedItems.includes(option.value)}
                  onClick={() => handleSelect(option.value)}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedItems([])}
            disabled={loading}
          >
            Clear
          </Button>
          <Button 
            onClick={handleApply}
            disabled={loading}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FilterCards() {
  const {
    selectedArtists,
    selectedLabels,
    selectedStyles,
    setArtists,
    setLabels,
    setStyles
  } = useFilterStore();

  const [options, setOptions] = React.useState<{
    artists: FilterOption[];
    labels: FilterOption[];
    styles: FilterOption[];
  }>({
    artists: [],
    labels: [],
    styles: []
  });

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const { data, error } = await fetchFilterOptions();
        if (error) throw error;
        if (data) setOptions(data);
      } catch (e) {
        setError('Failed to load filter options');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    loadFilterOptions();
  }, []);

  return (
    <>
      <FilterCard
        title="Artists"
        options={options.artists}
        selected={selectedArtists}
        onSelect={setArtists}
        loading={loading}
        error={error}
        icon={<User2 className="h-4 w-4" />}
      />
      <FilterCard
        title="Labels"
        options={options.labels}
        selected={selectedLabels}
        onSelect={setLabels}
        loading={loading}
        error={error}
        icon={<Disc className="h-4 w-4" />}
      />
      <FilterCard
        title="Styles"
        options={options.styles}
        selected={selectedStyles}
        onSelect={setStyles}
        loading={loading}
        error={error}
        icon={<Music className="h-4 w-4" />}
      />
    </>
  );
}