# Technical Insights from Previous Implementation

## Core Architectural Decisions

### 1. Alias-Based System
- Multiple sessions per alias is intentional and required
- Supports multi-device access and browser restarts
- Session identification hierarchy: alias > session_id
- 30-day persistence with cross-device sync

```typescript
// Correct implementation of session storage
interface SessionStorage {
  localStorage: {
    alias: string;
    language: 'es-CL' | 'en-US';
    viewPreferences: ViewPreferences;
  };
  
  cookies: {
    session_id: string;     // For database operations
    expires: Date;          // 30-day expiration
  };
}

// Correct alias-based query pattern
const { data: sessions } = await supabase
  .from('user_sessions')
  .select('id')
  .eq('alias', session.alias);
```

### 2. Status Management
All status values must be lowercase in database and match these exact values:
```typescript
type ReservationStatus = 
  | 'in_cart'    // Initially added to cart
  | 'reserved'   // Active reservation
  | 'in_queue'   // Waiting list
  | 'expired'    // Past 7-day period
  | 'sold'       // Completed purchase
  | 'cancelled'  // User cancelled
```

Error messages should be localized:
```typescript
const getErrorMessage = (error: string, language: 'es-CL' | 'en-US') => {
  const messages = {
    'session_error': {
      'es-CL': 'Error de sesión - por favor inicia sesión nuevamente',
      'en-US': 'Session error - please log in again'
    },
    'reservation_exists': {
      'es-CL': 'Ya tienes una reserva activa para este disco',
      'en-US': 'You already have an active reservation for this record'
    }
  };
  return messages[error][language];
};
```

### 3. Component Initialization and Path Resolution
Important considerations for Next.js and shadcn/ui setup:

#### Path Resolution
- Prefer path aliases when Next.js alias configuration is properly set up:
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// Preferred import style
import { Dialog } from '@/components/ui/dialog';
```

- Use relative imports as fallback when path resolution issues occur:
```typescript
// Fallback import style
import { Dialog } from '../ui/dialog';
```

#### shadcn/ui Setup
1. **Dependencies Installation**:
```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.1.0",
    "lucide-react": "^0.263.1"
  }
}
```

2. **Component Organization**:
```
src/
  components/
    ui/           # Base shadcn/ui components
      dialog.tsx
      button.tsx
      input.tsx
      label.tsx
      select.tsx
    session/      # Feature components
      SessionModal.tsx  # Uses ui components
```

3. **Component Initialization Order**:
- Install dependencies first
- Create utils.ts with cn helper
- Initialize base components
- Create feature components

4. **Common Issues & Solutions**:
- Missing peer dependencies can cause cryptic errors
- Always ensure Tailwind and PostCSS are properly configured
- Keep consistent relative/alias imports within components
- Add "use client" directive to interactive components

### 4. Database Patterns
[Content continues as before...]
