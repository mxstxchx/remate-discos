'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/stores/session';
import { SessionModal } from './SessionModal';
import { SessionErrorBoundary } from './SessionErrorBoundary';
import { supabase } from '@/lib/supabase/client';
import { hasValidSession, isSessionExpired } from '@/lib/session/errors';

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { sessionId, expiresAt, initializeSession, clearSession } = useSessionStore();

  // Initialize session status
  useEffect(() => {
    setMounted(true);
    
    // Check if session exists and is valid
    if (sessionId && !isSessionExpired(expiresAt)) {
      const validateSession = async () => {
        const { data: session } = await supabase
          .from('user_sessions')
          .select()
          .eq('id', sessionId)
          .single();

        if (session) {
          initializeSession(session);
        } else {
          clearSession();
          setModalOpen(true);
        }
      };

      validateSession();
    } else {
      clearSession();
      setModalOpen(true);
    }
  }, [sessionId, expiresAt, initializeSession, clearSession]);

  // Handle session expiration and cross-tab sync
  useEffect(() => {
    if (!mounted) return;

    const checkSession = () => {
      if (!hasValidSession()) {
        clearSession();
        setModalOpen(true);
      }
    };

    // Check every minute
    const interval = setInterval(checkSession, 60 * 1000);

    // Sync across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'remate-session') {
        checkSession();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, [mounted, clearSession]);

  if (!mounted) return null;

  return (
    <SessionErrorBoundary>
      <SessionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      {children}
    </SessionErrorBoundary>
  );
}