# 01. Next.js Integration Rules

## 1.1 Project Setup Rules

### Rule 1.1.1: Use official Next.js Supabase template
```bash
# Create new project with Supabase template
npx create-next-app -e with-supabase

# Or use specific template variants
npx create-next-app -e with-supabase-auth-realtime my-app
```

### Rule 1.1.2: Manual installation in existing Next.js project
```bash
npm install @supabase/supabase-js
npm install @supabase/ssr  # For SSR support
```

## 1.2 Client Configuration

### Rule 1.2.1: Environment variables setup
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rule 1.2.2: Client-side Supabase client
```javascript
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Rule 1.2.3: Server-side Supabase client with SSR support
```javascript
// utils/supabase/server.js
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie setting errors in middleware
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie removal errors
          }
        },
      },
    }
  )
}
```

## 1.3 App Router Integration (Next.js 13+)

### Rule 1.3.1: Server Component data fetching
```javascript
// app/instruments/page.tsx
import { createClient } from '@/utils/supabase/server'

export default async function InstrumentsPage() {
  const supabase = createClient()
  
  const { data: instruments, error } = await supabase
    .from('instruments')
    .select('*')

  if (error) {
    console.error('Error fetching instruments:', error)
    return <div>Error loading instruments</div>
  }

  return (
    <div>
      <h1>Instruments</h1>
      {instruments.map((instrument) => (
        <div key={instrument.id}>
          <h2>{instrument.name}</h2>
          <p>{instrument.category}</p>
        </div>
      ))}
    </div>
  )
}
```

### Rule 1.3.2: Client Component with authentication
```javascript
// components/AuthComponent.tsx
'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function AuthComponent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <p>Please sign in</p>
          <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  )
}
```

### Rule 1.3.3: Route Handlers (API Routes)
```javascript
// app/api/instruments/route.js
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  
  const { data: instruments, error } = await supabase
    .from('instruments')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ instruments })
}

export async function POST(request) {
  const supabase = createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('instruments')
    .insert(body)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data })
}
```

## 1.4 Pages Router Integration (Next.js 12 and below)

### Rule 1.4.1: getServerSideProps with authentication
```javascript
// pages/protected.js
import { createClient } from '@/utils/supabase/server'

export default function ProtectedPage({ user, instruments }) {
  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>{instrument.name}</li>
        ))}
      </ul>
    </div>
  )
}

export async function getServerSideProps(context) {
  const supabase = createClient(context)
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { data: instruments } = await supabase
    .from('instruments')
    .select('*')

  return {
    props: {
      user,
      instruments: instruments ?? [],
    },
  }
}
```

### Rule 1.4.2: getStaticProps for public data
```javascript
// pages/public-instruments.js
import { createClient } from '@/utils/supabase/server'

export default function PublicInstruments({ instruments }) {
  return (
    <div>
      <h1>Public Instruments</h1>
      {instruments.map((instrument) => (
        <div key={instrument.id}>
          <h2>{instrument.name}</h2>
          <p>{instrument.description}</p>
        </div>
      ))}
    </div>
  )
}

export async function getStaticProps() {
  const supabase = createClient()
  
  const { data: instruments } = await supabase
    .from('instruments')
    .select('*')
    .eq('public', true)

  return {
    props: {
      instruments: instruments ?? [],
    },
    revalidate: 60, // Revalidate every minute
  }
}
```

## 1.5 Middleware for Authentication

### Rule 1.5.1: Auth middleware setup
```javascript
// middleware.js
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect unauthenticated users to login
  if (!user && request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (user && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/protected/:path*', '/login', '/signup', '/dashboard/:path*']
}
```

## 1.6 Real-time Integration

### Rule 1.6.1: Real-time subscriptions in components
```javascript
// components/RealtimeInstruments.tsx
'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function RealtimeInstruments() {
  const [instruments, setInstruments] = useState([])
  const supabase = createClient()

  useEffect(() => {
    // Initial fetch
    const fetchInstruments = async () => {
      const { data } = await supabase
        .from('instruments')
        .select('*')
        .order('created_at', { ascending: false })
      
      setInstruments(data || [])
    }

    fetchInstruments()

    // Subscribe to changes
    const channel = supabase
      .channel('instruments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'instruments',
        },
        (payload) => {
          console.log('Change received!', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              setInstruments(prev => [payload.new, ...prev])
              break
            case 'UPDATE':
              setInstruments(prev =>
                prev.map(item =>
                  item.id === payload.new.id ? payload.new : item
                )
              )
              break
            case 'DELETE':
              setInstruments(prev =>
                prev.filter(item => item.id !== payload.old.id)
              )
              break
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div>
      <h2>Instruments (Real-time)</h2>
      {instruments.map((instrument) => (
        <div key={instrument.id}>
          <h3>{instrument.name}</h3>
          <p>{instrument.category}</p>
        </div>
      ))}
    </div>
  )
}
```

## 1.7 TypeScript Integration

### Rule 1.7.1: Generate TypeScript types
```bash
# Generate types from your Supabase schema
supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts

# Or if using linked project
supabase gen types typescript --linked > types/supabase.ts
```

### Rule 1.7.2: Use generated types
```typescript
// types/supabase.ts (generated)
export interface Database {
  public: {
    Tables: {
      instruments: {
        Row: {
          id: number
          name: string
          category: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          category: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          category?: string
          created_at?: string
        }
      }
    }
  }
}

// utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

// Usage in components
const { data: instruments } = await supabase
  .from('instruments')
  .select('*') // TypeScript now knows the shape of instruments
```

## 1.8 Error Handling and Loading States

### Rule 1.8.1: Comprehensive error boundary
```javascript
// components/ErrorBoundary.tsx
'use client'
import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Supabase error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong with the database connection.</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Rule 1.8.2: Loading states with Suspense
```javascript
// app/instruments/loading.tsx
export default function Loading() {
  return (
    <div className="loading">
      <h2>Loading instruments...</h2>
      <div className="spinner" />
    </div>
  )
}

// app/instruments/error.tsx
'use client'
export default function Error({ error, reset }) {
  return (
    <div className="error">
      <h2>Failed to load instruments</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```