export class SessionError extends Error {
  constructor(
    message: string,
    public code: SessionErrorCode,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SessionError';
  }
}

export type SessionErrorCode = 
  | 'QUERY_ERROR'
  | 'INSERT_ERROR'
  | 'ADMIN_AUTH_ERROR'
  | 'UNKNOWN_ERROR';

export interface SessionAuditLog {
  session_id: string;
  alias: string;
  is_admin: boolean;
  action: 'created' | 'expired' | 'destroyed';
  created_at: string;
}