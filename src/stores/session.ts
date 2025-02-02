import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from '@/types/session';

interface SessionState {
  alias: string | null;
  sessionId: string | null;
  language: 'es-CL' | 'en-US';
  expiresAt: Date | null;
  isInitialized: boolean;
  status: 'idle' | 'loading' | 'error';
  error: string | null;

  // Actions
  initializeSession: (session: Session) => void;
  clearSession: () => void;
  setLanguage: (language: 'es-CL' | 'en-US') => void;
  setError: (error: string | null) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      // Initial state
      alias: null,
      sessionId: null,
      language: 'es-CL',
      expiresAt: null,
      isInitialized: false,
      status: 'idle',
      error: null,

      // Actions
      initializeSession: (session: Session) => set({
        alias: session.alias,
        sessionId: session.id,
        language: session.preferred_language,
        expiresAt: new Date(session.expires_at),
        isInitialized: true,
        status: 'idle',
        error: null,
      }),

      clearSession: () => set({
        alias: null,
        sessionId: null,
        language: 'es-CL',
        expiresAt: null,
        isInitialized: true,
        status: 'idle',
        error: null,
      }),

      setLanguage: (language) => set({ language }),
      setError: (error) => set({ error, status: error ? 'error' : 'idle' }),
    }),
    {
      name: 'remate-session',
      partialize: (state) => ({
        alias: state.alias,
        sessionId: state.sessionId,
        language: state.language,
        expiresAt: state.expiresAt,
      }),
    }
  )
);