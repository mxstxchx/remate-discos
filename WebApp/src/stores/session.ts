import { create } from 'zustand'

interface SessionState {
  alias: string | null
  language: 'es-CL' | 'en-US'
  setAlias: (alias: string | null) => void
  setLanguage: (language: 'es-CL' | 'en-US') => void
}

export const useSessionStore = create<SessionState>((set) => ({
  alias: null,
  language: 'es-CL',
  setAlias: (alias) => set({ alias }),
  setLanguage: (language) => set({ language }),
}))