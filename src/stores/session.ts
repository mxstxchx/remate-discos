import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface SessionState {
  alias: string | null;
  language: 'es-CL' | 'en-US';
  sessionId: string | null;
  expiresAt: Date | null;
  status: 'active' | 'expired' | 'initial';
  isInitialized: boolean;
  lastActive: Date | null;
  error: string | null;

  setAlias: (alias: string) => void;
  setLanguage: (language: 'es-CL' | 'en-US') => void;
  setSessionId: (id: string) => void;
  setExpiresAt: (date: Date) => void;
  setStatus: (status: 'active' | 'expired' | 'initial') => void;
  setLastActive: (date: Date) => void;
  reset: () => void;
}

const useSessionStore = create<SessionState>(
  persist(
    (set) => ({
      alias: null,
      language: 'es-CL',
      sessionId: null,
      expiresAt: null,
      status: 'initial',
      isInitialized: false,
      lastActive: null,
      error: null,

      setAlias: (alias) => set({ alias }),
      setLanguage: (language) => set({ language }),
      setSessionId: (sessionId) => set({ sessionId }),
      setExpiresAt: (expiresAt) => set({ expiresAt }),
      setStatus: (status) => set({ status }),
      setLastActive: (lastActive) => set({ lastActive }),
      reset: () => set({
        alias: null,
        sessionId: null,
        expiresAt: null,
        status: 'initial',
        lastActive: null,
        error: null
      })
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({
        alias: state.alias,
        language: state.language,
        sessionId: state.sessionId
      })
    }
  )
);

export default useSessionStore;