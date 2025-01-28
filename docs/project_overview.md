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

2. **Language Support**
   - Spanish (Chile) - es-CL: Primary
   - English (US) - en-US: Secondary
   - Language selection in session modal
   - Stored in user_sessions table

[Previous database structure content...]

## Project Structure
```
/RemateDiscos/
├── docs/                    # Development documentation
│   ├── PRD.md              # Requirements
│   ├── project_overview.md  # Architecture
│   ├── technical_insights.md# Implementation details
│   └── supabase_exports/    # Database state
│       ├── Supabase_Public_Functions.json
│       ├── Supabase_Triggers.json
│       ├── Supabase_RLS_Policies.json
│       ├── Supabase_Indexes.json
│       └── Supabase_Enums.json
│
└── WebApp/                  # Application code
    ├── src/
    │   ├── app/            # Next.js App Router
    │   ├── components/     # React components
    │   ├── lib/           # Utilities and helpers
    │   ├── stores/        # Zustand stores
    │   └── types/         # TypeScript types
    ├── public/            # Static assets
    └── [Next.js config files]
```

## Database Schema

### Release Schema Image Handling
```typescript
interface Release {
  primary_image: string;    // High resolution main image
  secondary_image: string;  // Additional high res image
  
  // Image quality strategy
  images: {
    src: string;
    blurDataUrl?: string;  // For image optimization
    quality: 'high' | 'low';
  }[];
}
```

[Rest of database schema and implementation details...]