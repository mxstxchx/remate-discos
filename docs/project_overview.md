# Remate Discos - Project Overview

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 13+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS with CSS modules

### Key Design Decisions
1. **Session-Based Authentication**
   - Alias-based system with the following storage strategy:
     ```typescript
     interface SessionManagement {
       // Primary: Alias-based identification
       alias: string;
       
       // Storage Strategy
       localStorage: {
         alias: string;
         language: 'es-CL' | 'en-US';
         viewPreferences: ViewPreferences;
       };
       
       cookies: {
         session_id: string;  // Required for certain operations
         expires: Date;       // 30-day expiration
       };
     }
     ```
   - Support for multiple devices per alias
   - 30-day session persistence
   - No passwords required

2. **Database Structure**
   - PostgreSQL with JSONB for flexible data (labels, artists, styles)
   - Custom functions for complex queries
   - Row Level Security (RLS) for data protection
   - Audit logging for admin actions

[... rest of original content unchanged...]