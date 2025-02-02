export type Language = 'es-CL' | 'en-US';

export type SessionStatus = 
  | 'initializing'
  | 'no_session'
  | 'loading'
  | 'active'
  | 'error'
  | 'expired';

export interface UserSession {
  id: string;
  alias: string;
  preferred_language: Language;
  created_at: Date;
  last_active: Date;
  expires_at: Date;
  is_admin?: boolean;
}

export interface SessionStore {
  alias: string | null;
  language: Language;
  sessionId: string | null;
  expiresAt: Date | null;
  status: SessionStatus;
  isInitialized: boolean;
  lastActive: Date | null;
  error: string | null;
  
  // Actions
  initializeSession: () => Promise<void>;
  createSession: (alias: string, language: Language) => Promise<void>;
  refreshSession: () => Promise<void>;
  logout: () => void;
  updateLanguage: (language: Language) => void;
  setError: (error: string | null) => void;
}

export interface SessionProviderProps {
  children: React.ReactNode;
}