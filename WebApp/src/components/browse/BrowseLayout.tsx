"use client";

import { useState } from 'react';
import { FilterSidebar } from './FilterSidebar';
import { ReleaseGrid } from './ReleaseGrid';
import { FilterCards } from './FilterCards';
import { NavBar } from '../layout/NavBar';
import { Button } from '@/components/ui/button';
import { Menu, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function BrowseLayout() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <div className="flex-1">
        {/* Filter Cards Row - Aligned with main content */}
        <div className="container mx-auto px-4">
          <div className="lg:w-3/4 lg:ml-auto">
            <div className="flex items-center gap-4 py-6">
              <FilterCards />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Filter Button */}
            <div className="lg:hidden flex justify-end">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="py-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Sidebar - 25% on desktop, hidden on mobile */}
            <aside className="hidden lg:block lg:w-1/4">
              <FilterSidebar />
            </aside>
            
            {/* Main Content - 75% on desktop, full width on mobile */}
            <main className="lg:w-3/4 w-full">
              <ReleaseGrid />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}