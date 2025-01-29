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
3. **Database Structure**
   - PostgreSQL with JSONB for flexible data (labels, artists, styles)
   - Custom functions for complex queries
   - Row Level Security (RLS) for data protection
   - Audit logging for admin actions

## Core Systems

### 1. Browse & Filter System
The browse interface allows users to discover and filter vinyl records with a sophisticated filtering system.

#### Components
- **Filter Sidebar**: 25% width, sticky positioning
- **Results Grid**: 75% width, responsive layout
- **Filter Cards**: Top-mounted for artists, labels, styles
- **View Toggle**: Grid/List view options

#### Filter Implementation
- **Labels Filter**: 
  ```sql
  -- PostgreSQL function for JSONB array matching
  matches_any_label(p_labels text[]) returns table (release_id bigint)
  ```
  - Two-step query process for efficiency
  - Handles complex JSONB data structures
  - Supports multiple label selection

- **Condition Filter**:
  - Maps UI codes to database values (M -> "Mint")
  - Validates against allowed conditions
  - Multiple selection support

- **Price Range Filter**:
  - Dynamic min/max based on inventory
  - Real-time updates
  - Range: €3-€20

### 2. Cart & Reservation System
Handles temporary holds and purchase queueing for vinyl records.

#### Features
- 7-day reservation period
- Automatic queue management
- Multi-device cart syncing
- Real-time status updates

#### Status Flow
```typescript
type ReservationStatus = 
  | 'in_cart'    // Initially added to cart
  | 'reserved'   // Active reservation
  | 'in_queue'   // Waiting list
  | 'expired'    // Past 7-day period
  | 'sold'       // Completed purchase
  | 'cancelled'  // User cancelled
```

#### Implementation
- Uses Zustand for state management
- Real-time sync with Supabase
- Handles concurrent reservations
- Manages expiration automatically

### 3. Admin System
Provides management interface for administrators.

#### Features
- Reservation management
- Sales tracking
- Action audit log
- Queue management

#### Security
- Role-based access control
- Action logging
- Secure function execution
- Session validation

### 4. Session Management
Handles user sessions and device management.

#### Features
- Alias-based identification
- Multi-device support
- 30-day persistence
- Real-time synchronization

#### Implementation
- LocalStorage + Cookies hybrid storage
- Session store with Zustand
- Automatic cleanup
- Cross-tab synchronization

## Technical Details

### State Management
```typescript
// Main stores
interface CartStore {
  items: CartItem[];
  status: ReservationStatus;
  // ... other cart state
}

interface SessionStore {
  alias: string;
  language: 'es-CL' | 'en-US';
  // ... other session state
}

interface FilterStore {
  // ... filter state
}
```

### Data Flow
1. **Browse & Filter**:
   ```
   User Action -> Filter Store -> Query Builder -> Supabase -> UI Update
   ```

2. **Cart & Reservations**:
   ```
   User Action -> Cart Store -> Supabase -> Queue Check -> Status Update -> UI
   ```

### Performance Optimizations
1. **Query Optimizations**:
   - Custom PostgreSQL functions
   - Efficient JSONB queries
   - Proper indexing

2. **Frontend Optimizations**:
   - Request debouncing
   - Component memoization
   - Lazy loading
   - Image optimization

### Security Measures
1. **Database**:
   - Row Level Security (RLS)
   - Secure functions
   - Input validation

2. **Application**:
   - Data sanitization
   - Rate limiting
   - Error handling

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

### Schema Overview
```sql
-- User Sessions
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alias TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'es-CL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- Releases
CREATE TABLE releases (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  artists TEXT[] NOT NULL,
  labels JSONB NOT NULL,
  styles TEXT[] NOT NULL,
  year TEXT,
  country TEXT,
  notes TEXT,
  condition TEXT,
  price NUMERIC NOT NULL,
  primary_image TEXT,
  secondary_image TEXT,
  videos JSONB,
  needs_audio BOOLEAN DEFAULT FALSE,
  tracklist JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id BIGINT REFERENCES releases(id),
  user_session_id UUID REFERENCES user_sessions(id),
  status TEXT NOT NULL,
  position_in_queue INTEGER,
  reserved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  CONSTRAINT valid_status CHECK (
    status IN ('in_cart', 'reserved', 'in_queue', 'expired', 'sold', 'cancelled')
  )
);
```

### Image Quality Strategy
```typescript
interface Image {
  src: string;           // Source URL
  blurDataUrl?: string;  // Base64 blur placeholder
  quality: 'high' | 'low';
}

interface Release {
  primary_image: string;    // High resolution main image
  secondary_image: string;  // Additional high res image
  images: Image[];         // Quality variants
}
```

## Maintenance & Extension

### Feature Development Process
1. Create feature branch
2. Update database if needed
   - Run migrations
   - Update types
3. Implement feature
   - Components
   - State management
   - Tests
4. Create PR with:
   - Implementation details
   - Testing notes
   - Migration steps

### Common Tasks
1. **New Filter Type**:
   ```bash
   git checkout -b feature/new-filter
   ```
   - Update FilterState type
   - Add UI component
   - Update query builder
   - Add to filter store
   - Create PR

2. **New Admin Action**:
   ```bash
   git checkout -b feature/admin-action
   ```
   - Create PostgreSQL function
   - Update audit system
   - Add UI components
   - Create PR

## UI/UX Guidelines
- Mobile-first approach
- Language support:
  * Spanish (Chile) - es-CL
  * English (US) - en-US
- EUR currency format
- Consistent loading states
- Error feedback
- Responsive design

## Notes
- Environment variables in .env.local

### Development
```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Type check
npm run typecheck
```
