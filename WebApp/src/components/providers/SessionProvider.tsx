'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSessionStore } from '@/stores/sessionStore';
import { SessionModal } from '../session/SessionModal';

function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="h-32 w-32 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

function SessionError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  );
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { 
    initialize, 
    refresh, 
    status, 
    sessionId,
    lastActive,
    isInitialized,
    alias
  } = useSessionStore();

  // Handle client-side only mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await initialize();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to initialize session'));
      }
    };
    if (mounted) {
      init();
    }
  }, [mounted, initialize]);

  useEffect(() => {
    if (!sessionId || !lastActive || !mounted) return;

    const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    const checkAndRefresh = async () => {
      try {
        if (!lastActive) return;
        
        const timeSinceLastActive = Date.now() - lastActive.getTime();
        if (timeSinceLastActive <= REFRESH_THRESHOLD) {
          await refresh();
        }
      } catch (e) {
        console.error('Failed to refresh session:', e);
      }
    };

    const interval = setInterval(checkAndRefresh, REFRESH_THRESHOLD);
    return () => clearInterval(interval);
  }, [sessionId, lastActive, refresh, mounted]);

  // Don't render anything on the server
  if (!mounted) return null;

  if (error) {
    return <SessionError error={error} />;
  }

  const needsSession = isInitialized && !alias;

  return (
    <Suspense fallback={<LoadingState />}>
      <div className="min-h-screen bg-background">
        {needsSession && <SessionModal />}
        {children}
      </div>
    </Suspense>
  );
}