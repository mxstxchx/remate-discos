"use client";

import { BrowseLayout } from '@/components/browse/BrowseLayout';
import { useSessionStore } from '@/stores/sessionStore';

export default function SessionPage() {
  const { isInitialized } = useSessionStore();

  return (
    <main className="min-h-screen bg-background">
      <BrowseLayout />
    </main>
  );
}
