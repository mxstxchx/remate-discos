import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useFilterStore } from '@/stores/filterStore';

const conditionOptions = [
  { value: 'M', label: 'Mint' },
  { value: 'NM', label: 'Near Mint' },
  { value: 'VG+', label: 'Very Good Plus' },
  { value: 'VG', label: 'Very Good' },
  { value: 'G+', label: 'Good Plus' },
  { value: 'G', label: 'Good' }
];

export function FilterSidebar() {
  const { 
    priceRange, 
    selectedConditions, 
    setPriceRange, 
    setConditions 
  } = useFilterStore();

  const handlePriceChange = (value: number[]) => {
    setPriceRange({ min: value[0], max: value[1] });
  };

  const handleConditionChange = (value: string, checked: boolean) => {
    if (checked) {
      setConditions([...selectedConditions, value]);
    } else {
      setConditions(selectedConditions.filter(c => c !== value));
    }
  };

  return (
    <div className="space-y-6 sticky top-4">
      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pt-2">
            <Slider
              min={0}
              max={100}
              step={1}
              value={[priceRange.min, priceRange.max]}
              onValueChange={handlePriceChange}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>€{priceRange.min}</span>
              <span>€{priceRange.max}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condition Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {conditionOptions.map((condition) => (
              <div key={condition.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`condition-${condition.value}`}
                  checked={selectedConditions.includes(condition.value)}
                  onCheckedChange={(checked) => 
                    handleConditionChange(condition.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={`condition-${condition.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {condition.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}