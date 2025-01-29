import { StateCreator, create } from 'zustand';
import { PersistOptions, createJSONStorage, persist } from 'zustand/middleware';
import { Language, SessionStore, ViewPreferences } from '../types/session';

const DEFAULT_VIEW_PREFERENCES: ViewPreferences = {
  gridView: true,
  sortBy: 'date',
  sortOrder: 'desc',
};

// Define what we want to persist
interface PersistedState {
  viewPreferences: ViewPreferences;
  language: Language;
}

type SessionPersist = (
  config: StateCreator<SessionStore>,
  options: PersistOptions<SessionStore, PersistedState>
) => StateCreator<SessionStore>;

export const useSessionStore = create<SessionStore>(
  (persist as SessionPersist)(
    (set, get) => ({
      // State
      alias: null,
      language: 'es-CL',
      sessionId: null,
      expiresAt: null,
      viewPreferences: DEFAULT_VIEW_PREFERENCES,
      isInitialized: false,

      // Actions
      setAlias: (alias: string) => {
        set({ alias });
        localStorage.setItem('alias', alias);
      },

      setLanguage: (language: Language) => {
        set({ language });
        localStorage.setItem('language', language);
      },

      setSessionId: (sessionId: string, expiresAt: Date) => {
        set({ sessionId, expiresAt });
        document.cookie = `session_id=${sessionId}; expires=${expiresAt.toUTCString()}; path=/`;
      },

      setViewPreferences: (preferences: Partial<ViewPreferences>) => {
        set(state => ({
          viewPreferences: { ...state.viewPreferences, ...preferences }
        }));
      },

      initialize: async () => {
        const state = get();
        if (state.isInitialized) return;

        // Load from localStorage
        const storedAlias = localStorage.getItem('alias');
        const storedLanguage = localStorage.getItem('language') as Language;

        // Load session ID from cookies
        const sessionId = document.cookie
          .split('; ')
          .find(row => row.startsWith('session_id='))
          ?.split('=')[1];

        set({
          alias: storedAlias,
          language: storedLanguage || 'es-CL',
          sessionId: sessionId || null,
          isInitialized: true,
        });
      },

      clear: () => {
        localStorage.removeItem('alias');
        localStorage.removeItem('language');
        document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        set({
          alias: null,
          sessionId: null,
          expiresAt: null,
          viewPreferences: DEFAULT_VIEW_PREFERENCES,
          isInitialized: false,
        });
      },
    }),
    {
      name: 'remate-session-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedState => ({
        viewPreferences: state.viewPreferences,
        language: state.language,
      }),
    }
  )
);