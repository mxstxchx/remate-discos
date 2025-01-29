"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useFilterStore } from '@/stores/filterStore';
import { EuroIcon, Star } from 'lucide-react';

const conditionOptions = [
  { value: 'Mint', label: 'Mint' },
  { value: 'Near Mint', label: 'Near Mint' },
  { value: 'Very Good Plus', label: 'Very Good Plus' },
  { value: 'Very Good', label: 'Very Good' }
];

const PRICE_MIN = 3;
const PRICE_MAX = 20;

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

  React.useEffect(() => {
    // Initialize price range with actual min/max
    setPriceRange({ min: PRICE_MIN, max: PRICE_MAX });
  }, [setPriceRange]);

  return (
    <div className="space-y-6 sticky top-4">
      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EuroIcon className="h-4 w-4" />
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pt-2">
            <Slider
              min={PRICE_MIN}
              max={PRICE_MAX}
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
          <CardTitle className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Condition
          </CardTitle>
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