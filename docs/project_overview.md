# Project Overview

## Core Systems

### Session Management
- Alias-based authentication
- Single admin user `_soyelputoamo_`
- 30-day persistence
- Activity tracking
- Audit logging

### Technical Stack
- Next.js 14 (App Router)
- Supabase
- shadcn/ui (Theme required)
- TypeScript
- Tailwind CSS

### Database Structure
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

### Development Standards
- Strict logging prefixes
- Error boundary patterns
- Theme system integration
- Component isolation

### Security Model
- RLS policies
- Admin constraints
- Session validation
- Audit trails