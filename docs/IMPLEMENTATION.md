# Implementation Details

## Directory Structure

Key organization principles:

```
/src
  /components     # React components
    /session      # Session management UI
    /admin        # Admin interface
    /ui          # Base components
  /stores        # State management
    session.ts   # Session store
  /lib           # Utilities
    /supabase    # Database functions
  /app          # Next.js pages
```

## Session Management

### State Flow
```typescript
interface SessionState {
  alias: string | null;
  language: 'es-CL' | 'en-US';
  sessionId: string | null;
  expiresAt: Date | null;
  status: 'active' | 'expired' | 'initial';
}
```

### Storage Strategy
- LocalStorage: User preferences
- Cookies: Session identification
- Database: Session records

### Critical Paths
1. Session Creation
   - Alias validation
   - Language selection
   - Database record
   - Local storage sync

2. Session Validation
   - Expiration check
   - Status updates
   - Cross-tab sync

3. Admin Operations
   - Permission verification
   - Action logging
   - Status management

## Performance Considerations

### Import Resolution
- Path aliases for cleaner imports
- Proper chunking with Next.js
- Component lazy loading

### State Management
- Persistent storage configuration
- Cross-tab synchronization
- Minimal re-renders

### Database Access
- Efficient RLS policies
- Proper function permissions
- Query optimization

## Maintenance Notes

### Adding Features
1. Follow directory structure
2. Update relevant types
3. Add proper logging
4. Document changes

### Testing Focus
- Session persistence
- Admin functions
- Path resolution
- RLS policies

### Common Issues
1. Session expiration handling
2. Admin permission sync
3. Path resolution errors
4. Component loading order

## Configuration Files

### tsconfig.json
- Path aliases
- Strict type checking
- Module resolution

### next.config.js
- Page extensions
- Image optimization
- Build configuration

### components.json
- shadcn/ui setup
- Style configuration
- Component aliases