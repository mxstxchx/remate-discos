# Technical Insights from Previous Implementation

## Core Architectural Decisions

### 1. Alias-Based System
- Multiple sessions per alias is intentional and required
- Supports multi-device access and browser restarts
- Session identification hierarchy: alias > session_id
- 30-day persistence with cross-device sync

```typescript
interface SessionStorage {
  localStorage: {
    alias: string;
    language: 'es-CL' | 'en-US';
    viewPreferences: ViewPreferences;
  };
  
  cookies: {
    session_id: string;
    expires: Date;
  };
}
```

### 2. Status Values
All reservation status values must be one of:
- 'in_cart'
- 'reserved'
- 'in_queue'
- 'expired'
- 'sold'
- 'cancelled'

Error messages should be localized:
```typescript
const getErrorMessage = (error: string, language: 'es-CL' | 'en-US') => {
  const messages = {
    'session_error': {
      'es-CL': 'Error de sesión - por favor inicia sesión nuevamente',
      'en-US': 'Session error - please log in again'
    },
    // ... other error messages
  };
  return messages[error][language];
};
```

[Previous database patterns and implementation details...]

## Notes
- Always use correct status enum values from Supabase
- Implement proper error message localization
- Use both localStorage and cookies for session management
- Follow the established project structure