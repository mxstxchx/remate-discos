"use client";

import { useEffect } from 'react';
import { useSessionStore } from '@/stores/sessionStore';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useSessionStore.getState().initialize();

    // Set up interval to update last_active
    const intervalId = setInterval(async () => {
      const { sessionId } = useSessionStore.getState();
      if (sessionId) {
        try {
          await fetch('/api/session', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Failed to update session:', error);
        }
      }
    }, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  return <>{children}</>;
}
