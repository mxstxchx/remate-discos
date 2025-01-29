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

### 3. Database Patterns
- Use JSONB for flexible data (labels, artists, styles)
- Two-step query process for complex filters
- Proper RLS policies for data protection
- Status transitions must be handled at DB level

```sql
-- Example: Efficient JSONB label filtering
CREATE OR REPLACE FUNCTION matches_any_label(p_labels text[])
RETURNS TABLE (release_id bigint) SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
    SELECT r.id
    FROM releases r
    WHERE EXISTS (
      SELECT 1
      FROM jsonb_array_elements(r.labels::jsonb) l
      WHERE l->>'name' = any(p_labels)
    );
END;
$$ LANGUAGE plpgsql;
```

### 4. Image Handling
```typescript
interface Image {
  src: string;
  blurDataUrl?: string;  // For loading optimization
  quality: 'high' | 'low';
}

interface Release {
  primary_image: string;    // High resolution main image
  secondary_image: string;  // Additional high res image
  images: Image[];         // Quality variants
}

// Usage example
const optimizeImages = (release: Release) => {
  return {
    ...release,
    images: [
      {
        src: release.primary_image,
        quality: 'high',
        blurDataUrl: generateBlurUrl(release.primary_image)
      },
      {
        src: release.secondary_image,
        quality: 'high'
      }
    ]
  };
};
```

## Critical Implementation Details

### 1. Join Patterns
```typescript
// Correct join pattern for user sessions
.select(`
  *,
  user_session:user_sessions!inner(
    alias,
    preferred_language
  )
`)
.eq('user_session.alias', alias)
```

### 2. State Management Patterns
```typescript
// Cart store with status handling
const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: async (item) => {
    const status = await checkAvailability(item.id);
    if (status === 'available') {
      set((state) => ({
        items: [...state.items, { ...item, status: 'in_cart' }]
      }));
    }
  }
}));

// Session store with language support
const useSessionStore = create<SessionStore>((set) => ({
  alias: '',
  language: 'es-CL', // Default language
  setLanguage: (lang: 'es-CL' | 'en-US') => {
    set({ language: lang });
    localStorage.setItem('language', lang);
  }
}));
```

### 3. Mobile Considerations
- Filter sidebar as modal on mobile
- Grid adapts to screen width
- Touch-friendly controls
- Performance optimization for mobile

```typescript
// Mobile-first grid layout
const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;
```

## Error Prevention

### 1. Session Management
```typescript
const handleSessionError = (error: Error) => {
  const { language } = useSessionStore();
  if (!session?.alias) {
    toast.error(getErrorMessage('session_error', language));
    return false;
  }
  return true;
};
```

### 2. Queue Management
- Prevent self-queue joining
- Maintain queue position integrity
- Handle concurrent access
- Proper status transitions

```sql
-- Queue position management trigger
CREATE TRIGGER manage_reservation_queue
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION manage_queue_positions();
```

## Performance Patterns

### 1. Query Optimization
- Use RPC for complex operations
- Proper JSONB indexing
- Two-step filtering process
- Efficient array operations

### 2. Frontend Optimization
```typescript
// Component memoization
const ReleaseCard = memo(({ release }: Props) => {
  // Implementation
});

// Debounced filter updates
const debouncedFilter = debounce((value) => {
  applyFilters(value);
}, 300);

// Image loading optimization
const Image = ({ src, blurDataUrl }: ImageProps) => {
  return (
    <NextImage
      src={src}
      placeholder="blur"
      blurDataURL={blurDataUrl}
      loading="lazy"
    />
  );
};
```