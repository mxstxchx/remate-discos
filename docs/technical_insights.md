# Technical Implementation Insights

## Session Management

### Core Types
```typescript
interface SessionInit {
  modal: boolean;     // Modal display control
  redirect: string;   // Post-session path
  checkInterval: number; // Activity check interval
}

interface SessionState {
  alias: string;
  is_admin: boolean;
  last_active: Date;
  expires_at: Date;
}

type LogPrefix = {
  debug: '[DEV] session:';
  app: '[APP] Session:';
  temp: '[TEMP] check:';
}
```

### RLS Implementation
```sql
-- Admin access control
CREATE POLICY "admin_access" ON "public"."user_sessions"
FOR ALL USING (
  (NOT is_admin) OR 
  (is_admin AND alias = '_soyelputoamo_')
);
```

### UI Dependencies
- Theme system required for components
- Toast notifications for errors
- Modal state management
- Error boundaries

## Database Structure

### Core Tables
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alias TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

CREATE TABLE session_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES user_sessions(id),
  alias TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Logging Strategy
- Debug logs prefixed with [DEV]
- Application logs prefixed with [APP]
- Temporary logs prefixed with [TEMP]
- State transitions logged with context
- Error details preserved for audit

## Error Handling
```typescript
class SessionError extends Error {
  constructor(
    message: string,
    code: SessionErrorCode,
    details?: Record<string, unknown>
  )
}

type SessionErrorCode = 
  | 'QUERY_ERROR'
  | 'INSERT_ERROR'
  | 'ADMIN_AUTH_ERROR'
  | 'UNKNOWN_ERROR';
```

## Middleware Behavior
- Session validation on route change
- Modal trigger on session expiry
- Path protection based on session state
- Activity tracking integration