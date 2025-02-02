export type SessionLanguage = 'es-CL' | 'en-US';

export interface Session {
  id: string;
  alias: string;
  preferred_language: SessionLanguage;
  is_admin?: boolean;
  created_at: string;
  last_active: string;
  expires_at: string;
}

export interface SessionErrorResponse {
  code: string;
  details: string;
  hint: string;
  message: string;
}