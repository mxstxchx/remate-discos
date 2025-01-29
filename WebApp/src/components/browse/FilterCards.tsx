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
import { useFilterStore } from '@/stores/filterStore';
import { X, Search } from 'lucide-react';

interface FilterOption {
  value: string;
  count?: number;
}

interface FilterCardProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onSelect: (values: string[]) => void;
}

function FilterCard({ title, options, selected, onSelect }: FilterCardProps) {
  const [search, setSearch] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState(selected);

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
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-4 cursor-pointer hover:bg-accent">
          <div className="flex items-center justify-between">
            <span className="font-medium">{title}</span>
            {selected.length > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                {selected.length}
              </span>
            )}
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="space-y-2">
            {filteredOptions.map(option => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  selectedItems.includes(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
              >
                <span>{option.value}</span>
                {option.count && (
                  <span className="text-sm opacity-70">{option.count}</span>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setSelectedItems([])}>
            Clear
          </Button>
          <Button onClick={handleApply}>Apply</Button>
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

  // These would come from your Supabase query
  const [options, setOptions] = React.useState({
    artists: [] as FilterOption[],
    labels: [] as FilterOption[],
    styles: [] as FilterOption[]
  });

  React.useEffect(() => {
    // Fetch options from Supabase
    const fetchOptions = async () => {
      // TODO: Implement Supabase queries
      // const { data: artists } = await supabase...
    };
    
    fetchOptions();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FilterCard
        title="Artists"
        options={options.artists}
        selected={selectedArtists}
        onSelect={setArtists}
      />
      <FilterCard
        title="Labels"
        options={options.labels}
        selected={selectedLabels}
        onSelect={setLabels}
      />
      <FilterCard
        title="Styles"
        options={options.styles}
        selected={selectedStyles}
        onSelect={setStyles}
      />
    </div>
  );
}