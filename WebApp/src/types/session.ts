export type Language = 'es-CL' | 'en-US';

export interface ViewPreferences {
  gridView: boolean;
  sortBy: 'price' | 'date' | 'condition';
  sortOrder: 'asc' | 'desc';
}

export interface SessionState {
  alias: string | null;
  language: Language;
  sessionId: string | null;
  expiresAt: Date | null;
  viewPreferences: ViewPreferences;
  isInitialized: boolean;
}

export interface SessionActions {
  setAlias: (alias: string) => void;
  setLanguage: (language: Language) => void;
  setSessionId: (sessionId: string, expiresAt: Date) => void;
  setViewPreferences: (preferences: Partial<ViewPreferences>) => void;
  initialize: () => Promise<void>;
  clear: () => void;
}

export type SessionStore = SessionState & SessionActions;
