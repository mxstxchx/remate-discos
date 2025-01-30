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

### 5. Next.js Component Setup
Important considerations for Next.js and shadcn/ui implementation:

#### Path Resolution
Configure path aliases in tsconfig.json:
```typescript
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Implement both alias and relative import patterns:
```typescript
// Preferred: Path alias imports
import { Dialog } from '@/components/ui/dialog';

// Fallback: Relative imports when needed
import { Dialog } from '../ui/dialog';
```

#### shadcn/ui Dependencies
Ensure all required dependencies are installed:
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

### 6. Filter Implementation Patterns
Best practices learned from browse interface:

#### Mobile Filter Management
- Use Sheet component for mobile filter drawer:
```typescript
<Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
  <SheetTrigger asChild>
    <Button variant=\"outline\" size=\"sm\" className=\"flex items-center gap-2\">
      <Filter className=\"h-4 w-4\" />
      Price & Condition
    </Button>
  </SheetTrigger>
  <SheetContent side=\"left\">
    <FilterSidebar />
  </SheetContent>
</Sheet>
```

#### Efficient Filter Querying
Two-step query process for complex filters:
```typescript
// Step 1: Get IDs using custom function
const { data: labelFilteredIds } = await supabase
  .rpc('matches_any_label', {
    p_labels: filters.labels
  });

// Step 2: Apply remaining filters
let query = supabase.from('releases')
  .select('*')
  .in('id', labelFilteredIds.map(row => row.release_id));

// Additional filters using overlaps for OR conditions
if (filters.artists?.length) {
  query = query.overlaps('artists', filters.artists);
}
```

#### Filter UI Components
Tag-style multi-select implementation:
```typescript
function FilterBadge({ 
  value, 
  count, 
  selected, 
  onClick 
}: FilterBadgeProps) {
  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1 m-1 rounded-full cursor-pointer
        transition-colors text-sm
        ${selected 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary hover:bg-secondary/80'}
      `}
    >
      <span>{value}</span>
      {count && <span className=\"ml-2 opacity-70\">({count})</span>}
    </div>
  );
}
```

#### Layout Composition
75/25 split with proper content alignment:
```typescript
<div className=\"container mx-auto px-4\">
  {/* Filter Cards Row - Aligned with main content */}
  <div className=\"lg:w-3/4 lg:ml-auto\">
    <FilterCards />
  </div>
  
  {/* Main Content */}
  <div className=\"flex flex-col lg:flex-row gap-6\">
    <aside className=\"lg:w-1/4\">
      <FilterSidebar />
    </aside>
    <main className=\"lg:w-3/4\">
      <ReleaseGrid />
    </main>
  </div>
</div>
```

#### Component Organization
Follow this directory structure for clarity:
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
      SessionModal.tsx
```

#### Implementation Best Practices
- Add "use client" directive to all interactive components
- Keep consistent import patterns within components
- Initialize base components before feature components
- Handle path resolution issues gracefully with fallbacks
- Ensure Tailwind and PostCSS configuration is complete

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

// Image fallback handling
const getDisplayImage = (release: Release): string => {
  return release.primary_image || release.secondary_image || '/placeholder.jpg';
};
```