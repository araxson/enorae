# 01. Basic Client Setup Rules

## 1.1 JavaScript Client Initialization

### Rule 1.1.1: Standard client initialization
```javascript
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')
```

### Rule 1.1.2: Client initialization with options
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xyzcompany.supabase.co',
  'public-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)
```

## 1.2 Environment Variables Pattern

### Rule 1.2.1: Use environment variables for credentials
```javascript
// Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// SvelteKit
import { VITE_PUBLIC_SUPABASE_URL, VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public'

const supabase = createClient(VITE_PUBLIC_SUPABASE_URL, VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
```

## 1.3 Custom Configuration Rules

### Rule 1.3.1: Custom fetch implementation
```javascript
const supabase = createClient(
  'https://xyzcompany.supabase.co',
  'public-anon-key',
  {
    fetch: (...args) => fetch(...args),
  }
)
```

### Rule 1.3.2: Schema specification
```javascript
const supabase = createClient(
  'https://xyzcompany.supabase.co',
  'public-anon-key',
  {
    schema: 'custom_schema'
  }
)
```

## 1.4 Client Options Configuration

### Rule 1.4.1: Complete options pattern
```typescript
type SupabaseClientOptions = {
  autoRefreshToken?: boolean;
  cookieOptions?: SupabaseAuthClientOptions["cookieOptions"];
  detectSessionInUrl?: boolean;
  fetch?: Fetch;
  headers?: GenericObject;
  localStorage?: SupabaseAuthClientOptions["localStorage"];
  multiTab?: boolean;
  persistSession?: boolean;
  realtime?: RealtimeClientOptions;
  schema?: string;
  shouldThrowOnError?: boolean;
};
```

## 1.5 Framework-Specific Initialization

### Rule 1.5.1: Server-side initialization (Next.js)
```javascript
// Server component
import { createClient } from '@/utils/supabase/server'

const supabase = await createClient()
```

### Rule 1.5.2: Client-side initialization patterns
```javascript
// React hook pattern
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```