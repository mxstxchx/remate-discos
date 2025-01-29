import React from 'react';
import { FilterSidebar } from './FilterSidebar';
import { ReleaseGrid } from './ReleaseGrid';
import { FilterCards } from './FilterCards';

export function BrowseLayout() {
  return (
    <div className="container mx-auto px-4">
      {/* Top Filter Cards */}
      <div className="mb-6">
        <FilterCards />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - 25% on desktop, full width on mobile with modal */}
        <aside className="lg:w-1/4 hidden lg:block">
          <FilterSidebar />
        </aside>
        
        {/* Main Content - 75% on desktop, full width on mobile */}
        <main className="lg:w-3/4 w-full">
          <ReleaseGrid />
        </main>
      </div>
    </div>
  );
}