# Authentication (Supabase Auth)

**Purpose:** Supabase Auth-specific patterns for session management, client types, proxy/middleware, and RLS integration in Next.js App Router.

**Last Updated:** 2025-11-03 (Ultra-Deep Analysis Update)
**Stack Version:** Supabase JS 2.47.15+ (latest: 2.78+), @supabase/ssr 0.7.0+, Next.js 16+, Supabase Auth (GoTrue) latest, Node.js 20+

## Recent Updates (2025-11-03) - Ultra-Deep Analysis

**New Enterprise Features:**
- **Multi-Factor Authentication (MFA):** TOTP (App Authenticator), Phone (SMS/WhatsApp), WebAuthn support
- **Auth Hooks:** Custom Access Token Hook for JWT claim customization and RBAC
- **Anonymous Sign-In:** Full support for anonymous users with JWT claims
- **Enterprise SSO:** SAML 2.0 support for Azure AD, Okta, Google Workspace (Pro plans+)
- **Identity Linking:** Link multiple auth providers to single account

**New Security Features:**
- **Refresh Token Rotation:** Enhanced security with automatic token rotation detection and revocation (`GOTRUE_SECURITY_REFRESH_TOKEN_ROTATION_ENABLED`)
- **Session Timeboxing:** Configurable session timeouts with `GOTRUE_SESSIONS_TIMEBOX` and `GOTRUE_SESSIONS_INACTIVITY_TIMEOUT`
- **PKCE Flow:** Code Exchange support for improved OAuth security
- **Reauthentication Nonce:** New endpoint for sensitive operations requiring re-verification
- **Rate Limiting:** Built-in protection against brute force attacks
- **Account Enumeration Prevention:** Security measures against user discovery attacks

**Breaking Changes (Important):**
- ⚠️ **Node.js 18 EOL:** Node.js 18 reached end-of-life April 30, 2025. **Upgrade to Node.js 20+ by October 31, 2025** for continued compatibility
- ⚠️ **@supabase/ssr 0.7.0:** Updated cookie library (1.0.2), minor internal type changes (non-breaking)
- ⚠️ **auth-js monorepo:** auth-js repository moved to supabase-js monorepo (archive scheduled Oct 10, 2025)

**Deprecated Patterns:**
- ⚠️ `auth.email()` in RLS policies → Use `auth.jwt() ->> 'email'` instead
- ⚠️ Manual `refreshSession()` calls → Middleware handles automatically
- ⚠️ Old method names: `login()` → `signIn()`, `signup()` → `signUp()`, `logout()` → `signOut()` (deprecated in v1, removed in v2+)

**Performance Improvements:**
- `getClaims()` uses Web Crypto API (faster than `getUser()` for server-side validation)
- Optimized JWT claim extraction in RLS policies with subselect caching
- Reduced JWT size via Custom Access Token Hook (helps SSR performance)

---

## Reading Order

This file should be read **after** understanding:
- `01-architecture.md` - File structure for Supabase client utilities
- `02-typescript.md` - Type safety patterns
- `04-nextjs.md` - Server Components, Server Actions, middleware
- `05-database.md` - Supabase client creation, RLS fundamentals

**Cross-references:**
- RLS policies with `auth.uid()` → `05-database.md`
- Server Actions auth guards → `06-api.md`
- Form submission with auth → `07-forms.md`

---

## Quick Decision Tree

```
Auth Check Needed?
├─ Server Component → createClient (server) + getUser() → redirect if null
├─ Server Action → createClient (server) + getUser() → return error if null
├─ Route Handler → createClient (server) + getUser() → NextResponse 401 if null
├─ Middleware → createServerClient + getUser() → NextResponse.redirect if null
└─ Client Component → createClient (browser) + getSession() + onAuthStateChange

Session Validation?
├─ Need JWT verification → auth.getUser() (calls Auth server)
├─ Need JWT claims only → auth.getClaims() (faster, Web Crypto API)
└─ Cached session OK → auth.getSession() (client-side only, no verification)

Protected Route?
├─ Middleware → Check user, redirect to /login if null
├─ Server Component → getUser() early, redirect() if null
└─ Client Component → Gate UI on session before rendering

RLS Context?
├─ Always use server client → Passes session cookies → RLS enforced
├─ Service role client → Bypasses RLS (use for admin/backoffice only)
└─ Client queries → Browser client → RLS enforced via cookies
```

---

## Critical Rules

### Must Follow

1. **ALWAYS use `getUser()` for server-side auth validation** - Never trust `getSession()` alone on the server (JWT not verified)
2. **NEVER run code between `createServerClient` and `auth.getUser()`** - This is the most common cause of random logouts
3. **ALWAYS return the original `supabaseResponse` from proxy/middleware** - Mutating cookies incorrectly causes session desync
4. **ALWAYS use `createServerClient` with `getAll`/`setAll` cookie handlers** - Required for Next.js cookie API integration
5. **ALWAYS wrap `cookieStore.set()` in try/catch in Server Components** - Cannot mutate cookies in Server Component context
6. **ALWAYS call `auth.getUser()` in proxy/middleware** - Refreshes session for downstream Server Components (Next.js 16: `proxy.ts`, Next.js 15: `middleware.ts`)
7. **ALWAYS use `redirect()` from `next/navigation` after auth checks** - Proper Next.js navigation flow
8. **ALWAYS check `user` before RLS queries** - Unauthorized requests should fail fast

### FORBIDDEN

1. **DO NOT use `getSession()` alone for server-side authorization** - Session can be spoofed without JWT verification
2. **DO NOT implement custom cookie refresh logic** - Use official `updateSession` proxy/middleware pattern
3. **DO NOT store JWTs in localStorage without encryption** - Use HTTP-only cookies (default with Supabase SSR)
4. **DO NOT use Auth0, Clerk, NextAuth, or any auth provider except Supabase Auth** - Stack lock-in
5. **DO NOT skip proxy/middleware session refresh** - Server Components require fresh cookies (Next.js 16: `proxy.ts`, Next.js 15: `middleware.ts`)
6. **DO NOT create multiple Supabase clients in client components** - Use singleton pattern
7. **DO NOT mutate `supabaseResponse` cookies in proxy/middleware** - Return original response object
8. **DO NOT run RLS queries before checking `auth.getUser()`** - Queries will leak data or return empty results
9. **DO NOT use deprecated `auth.email()` in RLS policies** - Use `auth.jwt() ->> 'email'` instead (deprecated since 2024)
10. **DO NOT manually call `refreshSession()`** - Proxy/middleware handles token rotation automatically
11. **DO NOT use old method names** - `login()`, `signup()`, `logout()` are removed in v2+ (use `signIn()`, `signUp()`, `signOut()`)

---

## Patterns

### Pattern 1: Server Client Creation (Server Components, Server Actions, Route Handlers)

**When to use:** Any server-side context (Server Components, Server Actions, Route Handlers)

**Implementation:**

```ts
// ✅ CORRECT - lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component context - middleware handles refresh
          }
        },
      },
    }
  )
}
```

```ts
// ❌ WRONG - Missing try/catch, no async cookies()
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies() // Missing await

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // Missing try/catch - will crash in Server Components
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

**Why:** The try/catch allows the client to be used in Server Components (where cookies cannot be mutated). Middleware handles the actual session refresh.

---

### Pattern 2: Client-Side Client Creation (Client Components)

**When to use:** Browser-side authentication checks, real-time subscriptions, client-side queries

**Implementation:**

```ts
// ✅ CORRECT - lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

```tsx
// ✅ CORRECT - Using singleton in client component
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

// Create client once at module level
const supabase = createClient()

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!user) return <div>Please log in</div>

  return <div>Welcome, {user.email}</div>
}
```

```tsx
// ❌ WRONG - Creating client inside component (causes duplicate listeners)
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function UserProfile() {
  const supabase = createClient() // ❌ Creates new client on every render
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, []) // ❌ Missing cleanup, memory leak

  return <div>{user?.email}</div>
}
```

**Why:** Module-level singleton prevents duplicate WebSocket connections and auth listeners. Always unsubscribe in cleanup.

---

### Pattern 3: Proxy Session Refresh (Next.js 16)

**When to use:** ALWAYS - Required for Server Components to have fresh session cookies

**Implementation:**

```ts
// ✅ CORRECT - lib/supabase/middleware.ts (helper function)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Set on request for Server Components
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Create new response
          supabaseResponse = NextResponse.next({ request })
          // Set on response for browser
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // CRITICAL: Do NOT run code here - causes random logouts

  await supabase.auth.getUser() // Refresh session

  return supabaseResponse
}
```

```ts
// ✅ CORRECT - proxy.ts entry point (Next.js 16)
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Exclude static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Note:** Next.js 16 renamed `middleware.ts` → `proxy.ts` and `middleware()` → `proxy()`. For Next.js 15 and earlier, use `middleware.ts` with `export async function middleware(request: NextRequest)`. Use the codemod to migrate: `npx @next/codemod@canary middleware-to-proxy .`

```ts
// ❌ WRONG - Custom logic between createServerClient and getUser()
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(/* ... */)

  // ❌ NEVER run code here
  const userId = request.cookies.get('user_id')
  console.log('Checking user:', userId)

  await supabase.auth.getUser() // Too late - session already corrupted

  return supabaseResponse
}
```

**Why:** Running code between client creation and `getUser()` is the #1 cause of random session logouts. The proxy/middleware must refresh tokens atomically.

---

### Pattern 4: Protected Server Component

**When to use:** Any server component requiring authentication

**Implementation:**

```tsx
// ✅ CORRECT - Server Component with auth guard
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // RLS-protected query - user context automatically applied
  const { data: appointments } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('user_id', user.id)

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <pre>{JSON.stringify(appointments, null, 2)}</pre>
    </div>
  )
}
```

```tsx
// ❌ WRONG - Query before auth check
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  // ❌ Query runs before checking user - RLS fails or leaks data
  const { data: appointments } = await supabase.from('appointments_view').select('*')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Unauthorized</div> // ❌ Should redirect, not render
  }

  return <div>{JSON.stringify(appointments, null, 2)}</div>
}
```

**Why:** Always check `user` before queries. Use `redirect()` for proper Next.js navigation (not conditional rendering).

---

### Pattern 5: Server Action with Auth Guard

**When to use:** All Server Actions that mutate data or read user-specific data

**Implementation:**

```ts
// ✅ CORRECT - Server Action with auth guard
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { appointmentSchema } from './schema'

export async function createAppointment(_: unknown, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const payload = appointmentSchema.parse(Object.fromEntries(formData))

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({ ...payload, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/appointments')
  return { error: null }
}
```

```ts
// ❌ WRONG - Missing auth check, mutations leak across tenants
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAppointment(_: unknown, formData: FormData) {
  const supabase = await createClient()

  // ❌ No auth check - RLS might block silently or allow cross-tenant writes
  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert(Object.fromEntries(formData))

  if (error) return { error: error.message }

  revalidatePath('/dashboard/appointments')
  return { error: null }
}
```

**Why:** Always verify `user` before mutations. RLS policies may silently block unauthenticated requests (204 response with no data/error).

---

### Pattern 6: Middleware Protected Routes (Redirect Unauthenticated Users)

**When to use:** Protect entire route segments (e.g., `/dashboard/*`, `/admin/*`)

**Implementation:**

```ts
// ✅ CORRECT - Middleware with protected route logic
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect unauthenticated users away from protected routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from login page
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

```ts
// ❌ WRONG - Checking pathname before getUser()
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // ❌ Logic runs before auth check
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const supabase = createServerClient(/* ... */)
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}
```

**Why:** Always call `getUser()` immediately after `createServerClient()`. Conditional logic should only run after token refresh.

---

### Pattern 7: getUser vs getSession vs getClaims

**When to use:**
- `getUser()` - Server-side auth validation (calls Auth server, verifies JWT)
- `getClaims()` - Server-side auth validation (faster, uses Web Crypto API, no network call)
- `getSession()` - Client-side session retrieval (cached, no verification)

**Implementation:**

```ts
// ✅ CORRECT - Server-side: Use getUser() for auth validation
import { createClient } from '@/lib/supabase/server'

export async function validateUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
```

```ts
// ✅ CORRECT - Server-side: Use getClaims() for faster validation (new in 2024)
import { createClient } from '@/lib/supabase/server'

export async function validateUserFast() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  return data?.claims // Verified JWT claims without Auth server call
}
```

```tsx
// ✅ CORRECT - Client-side: Use getSession() for UI display
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const supabase = createClient()

export function UserAvatar() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user.email ?? null)
    })
  }, [])

  return <div>{email}</div>
}
```

```ts
// ❌ WRONG - Server-side using getSession() (no JWT verification)
import { createClient } from '@/lib/supabase/server'

export async function validateUser() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession() // ❌ Can be spoofed

  return session?.user // ❌ Not verified
}
```

**Decision Tree:**
```
Server-side?
├─ Need verification → getUser() or getClaims()
│  ├─ Network call OK → getUser() (traditional)
│  └─ Optimize performance → getClaims() (faster, Web Crypto API)
└─ Client-side?
   └─ UI display only → getSession() (cached, no verification needed)
```

**Why:** `getSession()` reads from storage without verification. Server-side code must use `getUser()` or `getClaims()` for security.

---

### Pattern 8: RLS Integration with auth.uid()

**When to use:** All RLS policies for user-scoped data

**Implementation:**

```sql
-- ✅ CORRECT - RLS policy using auth.uid()
create policy "Users view own appointments"
  on scheduling.appointments
  for select
  using (user_id = auth.uid());

create policy "Users create own appointments"
  on scheduling.appointments
  for insert
  with check (user_id = auth.uid());

-- ✅ CORRECT - Multi-tenant isolation with cached auth.uid()
create policy "Business owners view own salons"
  on organization.salons
  for select
  using (business_id = (select auth.uid()));

-- ✅ CORRECT - JWT claims for role-based access
create policy "Admins view all salons"
  on organization.salons
  for select
  using (
    (auth.jwt()->>'role')::text = 'admin'
  );

-- ✅ CORRECT - MFA enforcement using AAL claim
create policy "MFA required for sensitive data"
  on identity.user_profiles
  for select
  using (
    (auth.jwt()->>'aal')::text = 'aal2' -- MFA verified
  );
```

```sql
-- ❌ WRONG - No RLS policy (data leaks)
create table scheduling.appointments (
  id uuid primary key,
  user_id uuid references auth.users(id),
  -- ... other columns
);
-- ❌ Missing: alter table scheduling.appointments enable row level security;

-- ❌ WRONG - Policy not checking auth.uid()
create policy "Anyone can view appointments"
  on scheduling.appointments
  for select
  using (true); -- ❌ Leaks all data

-- ❌ WRONG - Calling auth.uid() per row (slow)
create policy "Users view own appointments"
  on scheduling.appointments
  for select
  using (user_id = auth.uid()); -- ❌ Not cached, runs per row
```

**Why:** Wrap `auth.uid()` in subselect `(select auth.uid())` to cache the JWT-derived value. Always enable RLS and target `TO authenticated`.

---

### Pattern 9: Sign In/Sign Up Server Actions

**When to use:** Authentication forms (login, signup, password reset)

**Implementation:**

```ts
// ✅ CORRECT - Login Server Action with proper revalidation
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from './schema'

export async function login(_: unknown, formData: FormData) {
  const payload = loginSchema.parse(Object.fromEntries(formData))
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(payload)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout') // Clear all cached data
  redirect('/dashboard')
}
```

```ts
// ✅ CORRECT - Sign Up Server Action
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signupSchema } from './schema'

export async function signup(_: unknown, formData: FormData) {
  const payload = signupSchema.parse(Object.fromEntries(formData))
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/auth/verify-email')
}
```

```ts
// ✅ CORRECT - Sign Out Server Action
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}
```

```ts
// ❌ WRONG - Not clearing cache after login
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(_: unknown, formData: FormData) {
  const supabase = await createClient()
  await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  redirect('/dashboard') // ❌ Missing revalidatePath - stale data persists
}
```

**Why:** Always call `revalidatePath('/', 'layout')` after auth state changes to clear cached data. Use Zod validation for inputs.

---

### Pattern 10: OAuth with Redirect Handling

**When to use:** Social login (Google, GitHub, etc.)

**Implementation:**

```tsx
// ✅ CORRECT - OAuth login in client component
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export function SocialLogin() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
  }

  return <button onClick={handleGoogleLogin}>Sign in with Google</button>
}
```

```ts
// ✅ CORRECT - OAuth callback handler (app/auth/callback/route.ts)
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, request.url))
}
```

```tsx
// ❌ WRONG - Relative redirectTo (fails in production)
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export function SocialLogin() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: '/auth/callback', // ❌ Must be absolute URL
      },
    })
  }

  return <button onClick={handleGoogleLogin}>Sign in with Google</button>
}
```

**Why:** OAuth `redirectTo` must be absolute URL. Exchange code for session in Route Handler before redirecting user.

---

### Pattern 11: Auth State Change Listener (Client)

**When to use:** Client components that need to react to auth state changes (sign in, sign out, token refresh)

**Implementation:**

```tsx
// ✅ CORRECT - Auth state change listener with cleanup
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const supabase = createClient()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      } else if (event === 'SIGNED_IN') {
        router.push('/dashboard')
      } else if (event === 'TOKEN_REFRESHED') {
        router.refresh() // Revalidate Server Components
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return <>{children}</>
}
```

```tsx
// ❌ WRONG - No cleanup, memory leak
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

const supabase = createClient()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
    })
    // ❌ Missing cleanup - subscription leaks
  }, [])

  return <>{children}</>
}
```

**Why:** Always unsubscribe from `onAuthStateChange` to prevent memory leaks. Use `router.refresh()` on `TOKEN_REFRESHED` to sync server state.

---

### Pattern 12: Session Management (Refresh Tokens)

**When to use:** Understanding how session refresh works (handled automatically by Supabase SSR)

**Implementation:**

```ts
// ✅ CORRECT - Middleware automatically refreshes tokens
// No manual refresh needed - handled by auth.getUser() in middleware

// Token lifecycle:
// 1. User signs in → receives access_token (1 hour TTL) + refresh_token
// 2. Middleware calls getUser() → checks if access_token expired
// 3. If expired → uses refresh_token to get new access_token
// 4. New tokens set in cookies → Server Components receive fresh session
```

```ts
// ❌ WRONG - Manual token refresh (not needed, breaks SSR flow)
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

const supabase = createClient()

export function ManualRefresh() {
  useEffect(() => {
    // ❌ NEVER manually refresh tokens - middleware handles this
    const interval = setInterval(async () => {
      await supabase.auth.refreshSession()
    }, 50000) // ❌ Breaks cookie sync

    return () => clearInterval(interval)
  }, [])

  return null
}
```

**Token Details:**
- **Access Token:** 1 hour TTL, used for RLS queries
- **Refresh Token:** Long-lived, used to get new access tokens
- **Middleware:** Automatically refreshes when access token expires
- **Client:** `onAuthStateChange` emits `TOKEN_REFRESHED` event

**Why:** Supabase SSR handles token refresh automatically. Manual refresh breaks cookie synchronization.

---

### Pattern 13: Reauthentication for Sensitive Operations (NEW in 2024)

**When to use:** Password changes, account deletion, or other high-security operations requiring re-verification

**Implementation:**

```ts
// ✅ CORRECT - Request reauthentication nonce for password change
'use server'

import { createClient } from '@/lib/supabase/server'

export async function requestPasswordChange() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Request reauthentication nonce (sent via email/SMS)
  const { error } = await supabase.auth.reauthenticate()

  if (error) return { error: error.message }

  return { success: true, message: 'Verification code sent' }
}

export async function updatePasswordWithNonce(_: unknown, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const newPassword = formData.get('password') as string
  const nonce = formData.get('nonce') as string

  // Update password using nonce for verification
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
    nonce,
  })

  if (error) return { error: error.message }

  return { success: true }
}
```

```ts
// ❌ WRONG - Password change without reauthentication
'use server'

import { createClient } from '@/lib/supabase/server'

export async function updatePassword(_: unknown, formData: FormData) {
  const supabase = await createClient()

  const newPassword = formData.get('password') as string

  // ❌ No reauthentication - security risk for sensitive operations
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) return { error: error.message }

  return { success: true }
}
```

**Why:** Sensitive operations like password changes should require recent authentication verification via nonce to prevent session hijacking attacks.

---

### Pattern 14: Advanced RLS with JWT Claims (Updated 2024)

**When to use:** Complex authorization scenarios with custom claims, roles, MFA enforcement

**Implementation:**

```sql
-- ✅ CORRECT - Modern JWT claim extraction (recommended since 2024)
create policy "Users view own profile"
  on identity.user_profiles
  for select
  using (
    (auth.jwt() ->> 'email') = email
  );

-- ✅ CORRECT - Role-based access with JWT claims
create policy "Admins view all profiles"
  on identity.user_profiles
  for select
  using (
    (auth.jwt() ->> 'role')::text = 'admin'
  );

-- ✅ CORRECT - Extract most recent auth method (MFA detection)
create policy "Require recent password auth for sensitive data"
  on finance.payment_methods
  for select
  using (
    (
      jsonb_path_query(
        (select auth.jwt()),
        '$.amr[0].method'
      )::text
    ) = '"password"'
  );

-- ✅ CORRECT - Conditional MFA enforcement (only for users who enabled it)
create policy "Enforce MFA for enrolled users"
  on identity.user_profiles
  as restrictive
  to authenticated
  using (
    array[(auth.jwt() ->> 'aal')] <@ (
      select
        case
          when count(id) > 0 then array['aal2']
          else array['aal1', 'aal2']
        end as aal
      from auth.mfa_factors
      where user_id = auth.uid() and status = 'verified'
    )
  );

-- ✅ CORRECT - Universal MFA enforcement
create policy "All users must use MFA"
  on finance.transactions
  as restrictive
  to authenticated
  using (
    (auth.jwt() ->> 'aal') = 'aal2'
  );
```

```sql
-- ❌ WRONG - Deprecated auth.email() function
create policy "Users view own profile"
  on identity.user_profiles
  for select
  using (
    auth.email() = email -- ❌ Deprecated since 2024
  );

-- ❌ WRONG - No MFA check for sensitive financial data
create policy "Anyone authenticated can view transactions"
  on finance.transactions
  for select
  to authenticated
  using (true); -- ❌ No AAL check, security risk
```

**JWT Claims Reference:**
- `sub` - User ID (same as `auth.uid()`)
- `email` - User email address
- `phone` - User phone number
- `role` - User role (`authenticated`, `anon`, custom roles)
- `aal` - Authenticator Assurance Level (`aal1` = single factor, `aal2` = MFA)
- `amr` - Authentication Method References (array of methods used)

**Why:** Modern JWT claim extraction using `auth.jwt() ->> 'claim'` is more flexible and future-proof. The deprecated `auth.email()` function is maintained for backward compatibility but will be removed in future versions.

---

### Pattern 15: Server-Side Refresh Token Rotation (Security Enhancement)

**When to use:** Production environments requiring enhanced security against token theft

**Implementation:**

```bash
# ✅ CORRECT - Enable refresh token rotation in Supabase Dashboard or .env
GOTRUE_SECURITY_REFRESH_TOKEN_ROTATION_ENABLED=true
GOTRUE_SECURITY_REFRESH_TOKEN_REUSE_INTERVAL=10
```

**How it works:**
1. User authenticates → receives `access_token` + `refresh_token`
2. Middleware calls `getUser()` → checks if `access_token` expired
3. If expired → uses `refresh_token` to get new tokens
4. **New behavior:** Old `refresh_token` is revoked, new one issued
5. **Security:** If old token reused within 10s window → all tokens revoked (potential theft detected)

```ts
// ✅ CORRECT - No code changes needed, middleware handles rotation automatically
// Token rotation is transparent when using official updateSession pattern

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Token rotation happens automatically in getUser() when enabled
  await supabase.auth.getUser()

  return supabaseResponse
}
```

```ts
// ❌ WRONG - Manual token refresh (breaks rotation security)
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

const supabase = createClient()

export function TokenRefresher() {
  useEffect(() => {
    const interval = setInterval(async () => {
      // ❌ Manual refresh bypasses rotation security
      await supabase.auth.refreshSession()
    }, 50000)

    return () => clearInterval(interval)
  }, [])

  return null
}
```

**Why:** Refresh token rotation detects and mitigates token theft. When enabled, stolen refresh tokens become invalid after first use, limiting attacker window. Middleware handles this automatically—no code changes required.

---

### Pattern 16: Session Timeboxing and Inactivity Timeouts (NEW in 2024)

**When to use:** Applications requiring automatic logout after inactivity or absolute session limits

**Implementation:**

```bash
# ✅ CORRECT - Configure session timeouts in Supabase Dashboard or .env
# Absolute session timeout (24 hours)
GOTRUE_SESSIONS_TIMEBOX=86400

# Inactivity timeout (1 hour)
GOTRUE_SESSIONS_INACTIVITY_TIMEOUT=3600

# Allow multiple sessions per user (default: true)
GOTRUE_SESSIONS_SINGLE_PER_USER=false
```

**How it works:**
- **Timebox:** Session expires after absolute duration (e.g., 24h) regardless of activity
- **Inactivity:** Session expires after period of no requests (e.g., 1h)
- **Single Session:** If enabled, new login revokes all previous sessions

```tsx
// ✅ CORRECT - Handle session expiration gracefully in client
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const supabase = createClient()

export function SessionMonitor() {
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Session expired due to timeout or was refreshed
        router.refresh()
      }

      if (event === 'SIGNED_OUT') {
        // Redirect to login on timeout
        router.push('/login?reason=session_expired')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return null
}
```

**Why:** Session timeboxing prevents indefinite session persistence, while inactivity timeouts protect against abandoned sessions. Both enhance security for sensitive applications (banking, healthcare, admin portals).

---

### Pattern 17: Multi-Factor Authentication (MFA) - TOTP Setup (NEW in 2024)

**When to use:** Applications requiring enhanced security (financial apps, healthcare, admin portals)

**Implementation:**

```tsx
// ✅ CORRECT - MFA Enrollment Flow (TOTP)
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const supabase = createClient()

export function MFAEnrollment() {
  const [qrCode, setQRCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)

  const enrollMFA = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'My Authenticator App',
    })

    if (error) {
      console.error('MFA enrollment error:', error.message)
      return
    }

    // data.totp.qr_code = data URI for QR code
    // data.totp.secret = secret key for manual entry
    // data.totp.uri = otpauth:// URI
    setQRCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setFactorId(data.id)
  }

  const verifyMFA = async (code: string) => {
    if (!factorId) return

    const { data, error } = await supabase.auth.mfa.challenge({
      factorId,
    })

    if (error) {
      console.error('Challenge error:', error.message)
      return
    }

    const challengeId = data.id

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code,
    })

    if (verifyError) {
      console.error('Verification error:', verifyError.message)
      return
    }

    alert('MFA enrolled successfully!')
  }

  return (
    <div>
      <button onClick={enrollMFA}>Enable MFA</button>
      {qrCode && (
        <div>
          <QRCodeSVG value={qrCode} />
          <p>Secret: {secret}</p>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            onChange={(e) => verifyMFA(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}
```

```tsx
// ✅ CORRECT - MFA Login Flow
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const supabase = createClient()

export function MFALogin() {
  const [needsMFA, setNeedsMFA] = useState(false)
  const [factorId, setFactorId] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      return
    }

    // Check if user has MFA enabled
    const { data: factors } = await supabase.auth.mfa.listFactors()

    if (factors && factors.totp.length > 0) {
      setNeedsMFA(true)
      setFactorId(factors.totp[0].id)
    }
  }

  const verifyMFACode = async (code: string) => {
    if (!factorId) return

    const { data: challenge } = await supabase.auth.mfa.challenge({
      factorId,
    })

    if (!challenge) return

    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })

    if (error) {
      console.error('MFA verification error:', error.message)
      return
    }

    // User is now fully authenticated with AAL2
    window.location.href = '/dashboard'
  }

  if (needsMFA) {
    return (
      <div>
        <h2>Enter MFA Code</h2>
        <input
          type="text"
          placeholder="6-digit code"
          onChange={(e) => verifyMFACode(e.target.value)}
        />
      </div>
    )
  }

  return <div>{/* Login form */}</div>
}
```

**AAL Levels (Authenticator Assurance Level):**
- **AAL1:** Single factor (email+password, magic link, social login)
- **AAL2:** Multi-factor verified (TOTP, Phone, WebAuthn)

**Why:** MFA provides enhanced security for sensitive operations. Use `auth.jwt() ->> 'aal'` in RLS policies to enforce MFA for specific data access.

---

### Pattern 18: Enforce MFA with RLS Policies (NEW in 2024)

**When to use:** Financial data, PII, admin operations requiring MFA verification

**Implementation:**

```sql
-- ✅ CORRECT - Require MFA (AAL2) for sensitive financial data
create policy "MFA required for transactions"
  on finance.transactions
  as restrictive
  to authenticated
  using (
    (auth.jwt() ->> 'aal') = 'aal2'
  );

-- ✅ CORRECT - Conditional MFA enforcement (only for users who enabled MFA)
create policy "Enforce MFA for enrolled users"
  on identity.user_profiles
  as restrictive
  to authenticated
  using (
    array[(auth.jwt() ->> 'aal')] <@ (
      select
        case
          when count(id) > 0 then array['aal2']
          else array['aal1', 'aal2']
        end as aal
      from auth.mfa_factors
      where user_id = auth.uid() and status = 'verified'
    )
  );

-- ✅ CORRECT - Recent auth method check (password re-auth required)
create policy "Require recent password auth for payment methods"
  on finance.payment_methods
  for select
  using (
    (
      jsonb_path_query(
        (select auth.jwt()),
        '$.amr[0].method'
      )::text
    ) = '"password"'
  );
```

```sql
-- ❌ WRONG - No MFA enforcement on sensitive data
create policy "Anyone authenticated can view transactions"
  on finance.transactions
  for select
  to authenticated
  using (true); -- ❌ AAL1 users can access sensitive financial data
```

**JWT AMR (Authentication Method References):**
- Shows authentication methods used in current session
- Format: `[{method: "password", timestamp: 1234567890}, {method: "totp", timestamp: 1234567900}]`
- Most recent method is first in array

**Why:** AAL-based RLS policies enforce MFA at the database level. Use `restrictive` policies to layer security requirements.

---

### Pattern 19: Phone-Based MFA (SMS/WhatsApp) (NEW in 2024)

**When to use:** Users without authenticator apps, regions with high mobile penetration

**Implementation:**

```tsx
// ✅ CORRECT - Phone MFA Enrollment
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const supabase = createClient()

export function PhoneMFAEnrollment() {
  const [phone, setPhone] = useState('')
  const [factorId, setFactorId] = useState<string | null>(null)

  const enrollPhone = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'phone',
      phone: phone, // E.164 format: +1234567890
    })

    if (error) {
      console.error('Phone MFA enrollment error:', error.message)
      return
    }

    setFactorId(data.id)
    // SMS/WhatsApp code sent to user's phone
  }

  const verifyPhoneCode = async (code: string) => {
    if (!factorId) return

    const { data: challenge } = await supabase.auth.mfa.challenge({
      factorId,
    })

    if (!challenge) return

    const { error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })

    if (error) {
      console.error('Phone MFA verification error:', error.message)
      return
    }

    alert('Phone MFA enrolled successfully!')
  }

  return (
    <div>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+1234567890"
      />
      <button onClick={enrollPhone}>Send Code</button>
      <input
        type="text"
        placeholder="Enter code"
        onChange={(e) => verifyPhoneCode(e.target.value)}
      />
    </div>
  )
}
```

**Configuration Notes:**
- Phone MFA shares configuration with phone auth login
- Supports SMS and WhatsApp providers
- Requires E.164 format phone numbers (`+[country][number]`)
- Phone messaging configuration in Dashboard → Auth → Providers → Phone

**Why:** Phone MFA provides alternative for users without authenticator apps. Note: SMS is less secure than TOTP (SIM swapping attacks).

---

### Pattern 20: List and Unenroll MFA Factors (NEW in 2024)

**When to use:** User settings, account management, device management

**Implementation:**

```tsx
// ✅ CORRECT - List and manage MFA factors
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { Factor } from '@supabase/supabase-js'

const supabase = createClient()

export function MFAManagement() {
  const [factors, setFactors] = useState<Factor[]>([])

  useEffect(() => {
    loadFactors()
  }, [])

  const loadFactors = async () => {
    const { data } = await supabase.auth.mfa.listFactors()

    if (data) {
      // data.totp = TOTP factors
      // data.phone = Phone factors
      // data.all = all factors
      setFactors(data.all)
    }
  }

  const unenrollFactor = async (factorId: string) => {
    const { error } = await supabase.auth.mfa.unenroll({
      factorId,
    })

    if (error) {
      console.error('Unenroll error:', error.message)
      return
    }

    // Refresh list
    loadFactors()
  }

  return (
    <div>
      <h2>Your MFA Devices</h2>
      {factors.map((factor) => (
        <div key={factor.id}>
          <p>
            {factor.friendly_name || 'Unnamed'} ({factor.factor_type})
          </p>
          <p>Status: {factor.status}</p>
          <p>Created: {new Date(factor.created_at).toLocaleString()}</p>
          <button onClick={() => unenrollFactor(factor.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
```

**Factor Limits:**
- Maximum 10 factors per user
- Factors can be TOTP, Phone, or WebAuthn
- Status can be `unverified` or `verified`

**Why:** Users may have multiple devices or need to remove lost devices. Always verify user identity before allowing unenrollment.

---

### Pattern 21: Anonymous Sign-In (NEW in 2024)

**When to use:** Guest users, trial experiences, shopping carts before account creation

**Implementation:**

```tsx
// ✅ CORRECT - Anonymous sign-in with later account linking
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export function AnonymousAuth() {
  const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously()

    if (error) {
      console.error('Anonymous sign-in error:', error.message)
      return
    }

    // User is now authenticated with anonymous session
    // JWT claim: "is_anonymous": true
    console.log('Anonymous user:', data.user.id)
  }

  const linkEmailToAnonymous = async (email: string, password: string) => {
    // Link email/password to anonymous account
    const { error } = await supabase.auth.updateUser({
      email,
      password,
    })

    if (error) {
      console.error('Linking error:', error.message)
      return
    }

    // Anonymous user is now permanent with email/password
  }

  return (
    <div>
      <button onClick={signInAnonymously}>Continue as Guest</button>
      {/* Later: offer to create account */}
    </div>
  )
}
```

**RLS Policy for Anonymous Users:**

```sql
-- ✅ CORRECT - Allow anonymous users to create temp cart
create policy "Anonymous users can create cart"
  on commerce.carts
  for insert
  to authenticated
  with check (
    (auth.jwt() ->> 'is_anonymous')::boolean = true
    and user_id = auth.uid()
  );

-- ✅ CORRECT - Upgrade anonymous cart to permanent user
create policy "Users can claim anonymous carts"
  on commerce.carts
  for update
  to authenticated
  using (
    user_id = auth.uid()
  );
```

**JWT Claims for Anonymous Users:**
- `is_anonymous`: `true`
- `amr`: `[{method: "anonymous", timestamp: ...}]`
- All other standard claims present

**Why:** Anonymous sign-in enables guest experiences with data persistence. Later convert to permanent account without data loss.

---

### Pattern 22: Custom Access Token Hook (RBAC with JWT Claims) (NEW in 2024)

**When to use:** Role-based access control, custom permissions, multi-tenant applications

**Implementation:**

```sql
-- ✅ CORRECT - Custom Access Token Hook for RBAC
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role text;
  user_permissions text[];
  user_tenant_id uuid;
begin
  -- Get user role and permissions from database
  select
    role,
    permissions,
    tenant_id
  into
    user_role,
    user_permissions,
    user_tenant_id
  from public.user_profiles
  where user_id = (event->>'user_id')::uuid;

  -- Extract existing claims
  claims := event->'claims';

  -- Add custom claims to JWT
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  claims := jsonb_set(claims, '{permissions}', to_jsonb(user_permissions));
  claims := jsonb_set(claims, '{tenant_id}', to_jsonb(user_tenant_id));

  -- Update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;

-- Grant necessary permissions
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
grant all on table public.user_profiles to supabase_auth_admin;

-- Enable the hook in Supabase Dashboard → Auth → Hooks → Custom Access Token
```

**Using Custom Claims in RLS:**

```sql
-- ✅ CORRECT - Role-based RLS policy
create policy "Admins view all salons"
  on organization.salons
  for select
  using (
    (auth.jwt() ->> 'user_role')::text = 'admin'
  );

-- ✅ CORRECT - Permission-based RLS policy
create policy "Users with view_analytics permission"
  on analytics.reports
  for select
  using (
    (auth.jwt() -> 'permissions')::jsonb ? 'view_analytics'
  );

-- ✅ CORRECT - Multi-tenant isolation
create policy "Users view own tenant data"
  on public.documents
  for select
  using (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
  );
```

**Client-Side Access to Custom Claims:**

```tsx
// ✅ CORRECT - Access custom claims in client
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const supabase = createClient()

export function UserRole() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.app_metadata.user_role) {
        setRole(session.user.app_metadata.user_role as string)
      }
    })
  }, [])

  return <div>Role: {role}</div>
}
```

**Important Notes:**
- Hook runs before token issuance
- Must return valid JWT claims
- Use for RBAC, multi-tenant isolation, custom permissions
- Reduces JWT size by removing unnecessary claims if needed

**Why:** Custom Access Token Hook enables sophisticated authorization without additional database queries. RLS policies can enforce permissions at database level.

---

### Pattern 23: Passwordless Magic Link Authentication (NEW in 2024)

**When to use:** Improved UX, mobile-first apps, reducing password fatigue

**Implementation:**

```tsx
// ✅ CORRECT - Magic Link Server Action
'use server'

import { createClient } from '@/lib/supabase/server'

export async function sendMagicLink(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Check your email for the magic link!' }
}
```

```tsx
// ✅ CORRECT - Email OTP (alternative to magic link)
'use server'

import { createClient } from '@/lib/supabase/server'

export async function sendEmailOTP(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // Create account if doesn't exist
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Check your email for the 6-digit code!' }
}

export async function verifyEmailOTP(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const token = formData.get('token') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
```

**Configuration:**
- Enable in Dashboard → Auth → Providers → Email
- Magic Links are one-time use only
- OTPs expire after configurable time (default: 60 seconds)
- Both enabled by default

**Why:** Passwordless auth improves security (no password to steal) and UX (no password to remember). Magic links better for desktop, OTPs better for mobile.

---

### Pattern 24: Enterprise SSO with SAML 2.0 (Pro Plans+)

**When to use:** Enterprise customers, organizations with existing identity providers

**Implementation:**

**Step 1: Configure SAML Provider (Server-Side)**

```bash
# Install Supabase CLI v1.46.4+
supabase sso add

# Follow prompts to configure:
# - Provider name (e.g., "okta", "azure-ad")
# - Metadata URL or XML
# - Attribute mappings
```

**Step 2: Initiate SSO Login (Client-Side)**

```tsx
// ✅ CORRECT - SSO Login Flow
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export function SSOLogin() {
  const loginWithSSO = async (domain: string) => {
    const { data, error } = await supabase.auth.signInWithSSO({
      domain, // e.g., "company.com"
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('SSO error:', error.message)
      return
    }

    // Redirect to identity provider
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <div>
      <input
        type="email"
        placeholder="work@company.com"
        onChange={(e) => {
          const domain = e.target.value.split('@')[1]
          if (domain) loginWithSSO(domain)
        }}
      />
    </div>
  )
}
```

**Supported Providers:**
- Microsoft Active Directory (Azure AD, Microsoft Entra)
- Okta
- Google Workspace (G Suite)
- PingIdentity
- OneLogin
- Any SAML 2.0 compliant provider

**Why:** Enterprise SSO enables seamless integration with corporate identity management, supports compliance requirements, and provides centralized access control.

---

### Pattern 25: Security Hardening - Rate Limiting and Brute Force Protection

**When to use:** All production applications

**Implementation:**

**Built-In Protection:**
- Supabase Auth includes automatic rate limiting on all endpoints
- Cloudflare CDN-level protection against DDoS
- fail2ban protection against brute force logins

**Additional Server-Side Rate Limiting:**

```ts
// ✅ CORRECT - Custom rate limiting for sensitive operations
'use server'

import { createClient } from '@/lib/supabase/server'

// Simple in-memory rate limiter (use Redis in production)
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

export async function rateLimit(identifier: string, maxAttempts = 5, windowMs = 300000) {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)

  if (attempts && attempts.resetAt > now) {
    if (attempts.count >= maxAttempts) {
      return {
        limited: true,
        retryAfter: Math.ceil((attempts.resetAt - now) / 1000),
      }
    }
    attempts.count++
  } else {
    loginAttempts.set(identifier, { count: 1, resetAt: now + windowMs })
  }

  return { limited: false }
}

export async function loginWithRateLimit(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Check rate limit
  const rateCheck = await rateLimit(email)
  if (rateCheck.limited) {
    return {
      error: `Too many attempts. Try again in ${rateCheck.retryAfter} seconds.`,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Clear rate limit on successful login
  loginAttempts.delete(email)
  return { success: true }
}
```

**RLS Policy for Failed Login Tracking:**

```sql
-- ✅ CORRECT - Track failed login attempts
create table security.failed_logins (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  ip_address inet,
  attempted_at timestamptz default now(),
  user_agent text
);

-- Log failed attempts (call from Edge Function or trigger)
create or replace function security.log_failed_login(
  p_email text,
  p_ip_address inet,
  p_user_agent text
)
returns void
language plpgsql
security definer
as $$
begin
  insert into security.failed_logins (email, ip_address, user_agent)
  values (p_email, p_ip_address, p_user_agent);
end;
$$;
```

**Why:** Rate limiting prevents brute force attacks, credential stuffing, and account enumeration. Always implement multiple layers of protection.

---

### Pattern 26: Account Enumeration Prevention

**When to use:** All production applications

**Implementation:**

```ts
// ✅ CORRECT - Generic error messages (prevent account enumeration)
'use server'

import { createClient } from '@/lib/supabase/server'

export async function signup(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  // ✅ Generic message - don't reveal if account exists
  if (error) {
    return { error: 'Unable to create account. Please try again.' }
  }

  return { success: true, message: 'Check your email to verify your account.' }
}

export async function resetPassword(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  // ✅ Always return success - don't reveal if email exists
  return {
    success: true,
    message: 'If an account exists, you will receive a password reset email.',
  }
}
```

```ts
// ❌ WRONG - Specific error messages reveal account existence
export async function signup(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password: formData.get('password') as string,
  })

  if (error) {
    // ❌ Reveals if account exists
    if (error.message.includes('already registered')) {
      return { error: 'This email is already registered.' }
    }
    return { error: error.message }
  }

  return { success: true }
}
```

**Why:** Account enumeration attacks allow attackers to discover valid user accounts. Always use generic error messages for authentication operations.

---

### Pattern 27: GDPR Compliance - Account Deletion and Data Export

**When to use:** Applications serving EU users, compliance requirements

**Implementation:**

```ts
// ✅ CORRECT - GDPR-compliant account deletion
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteAccount() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 1. Export user data (GDPR right to data portability)
  const { data: userData } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: userAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', user.id)

  // Send data export to user email
  await sendDataExportEmail(user.email!, {
    profile: userData,
    appointments: userAppointments,
  })

  // 2. Delete user data (GDPR right to be forgotten)
  // CASCADE deletes will handle related data if FK constraints configured
  await supabase.rpc('delete_user_data', { user_id: user.id })

  // 3. Delete auth user (cannot be undone)
  const { error } = await supabase.auth.admin.deleteUser(user.id)

  if (error) {
    return { error: 'Failed to delete account. Please contact support.' }
  }

  redirect('/account-deleted')
}

async function sendDataExportEmail(email: string, data: unknown) {
  // Implementation using email service
  console.log('Sending data export to:', email, data)
}
```

**Database Function for Complete Data Deletion:**

```sql
-- ✅ CORRECT - GDPR-compliant data deletion function
create or replace function public.delete_user_data(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Delete PII and user data across all tables
  delete from public.user_profiles where user_id = delete_user_data.user_id;
  delete from scheduling.appointments where user_id = delete_user_data.user_id;
  delete from finance.transactions where user_id = delete_user_data.user_id;
  delete from communication.messages where sender_id = delete_user_data.user_id;

  -- Anonymize data that must be retained (e.g., for legal/accounting)
  update analytics.user_events
  set user_id = null, anonymized = true
  where user_id = delete_user_data.user_id;

  -- Log deletion for compliance audit trail
  insert into security.data_deletions (user_id, deleted_at, deleted_by)
  values (delete_user_data.user_id, now(), auth.uid());
end;
$$;
```

**Audit Logging for Compliance:**

```sql
-- ✅ CORRECT - Audit log for GDPR compliance
create table security.data_deletions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  deleted_at timestamptz default now(),
  deleted_by uuid references auth.users(id),
  reason text
);

create table security.data_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  exported_at timestamptz default now(),
  exported_by uuid references auth.users(id),
  export_format text default 'json'
);
```

**Why:** GDPR requires user data deletion within 30 days of request and data portability on demand. Maintain audit trails for compliance verification.

---

### Pattern 28: Email and Phone Verification

**When to use:** User registration, account security, preventing spam

**Implementation:**

```ts
// ✅ CORRECT - Email verification flow
'use server'

import { createClient } from '@/lib/supabase/server'

export async function resendVerificationEmail() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  if (user.email_confirmed_at) {
    return { error: 'Email already verified' }
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email!,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Verification email sent!' }
}
```

**Configuration:**
- Enable email confirmation: Dashboard → Auth → Providers → Email → Confirm email
- Disable auto-confirm for security

**RLS Policy for Verified Users Only:**

```sql
-- ✅ CORRECT - Require email verification for sensitive operations
create policy "Only verified users can book appointments"
  on scheduling.appointments
  for insert
  to authenticated
  with check (
    (auth.jwt() ->> 'email_confirmed_at') is not null
    and user_id = auth.uid()
  );
```

**Why:** Email verification prevents spam accounts, ensures contact deliverability, and adds security layer.

---

### Pattern 29: Account Recovery and Password Reset

**When to use:** User account management, password reset flows

**Implementation:**

```ts
// ✅ CORRECT - Password reset flow
'use server'

import { createClient } from '@/lib/supabase/server'

export async function requestPasswordReset(_: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  // Always return success to prevent account enumeration
  return {
    success: true,
    message: 'If an account exists, you will receive a password reset email.',
  }
}

export async function updatePassword(_: unknown, formData: FormData) {
  const newPassword = formData.get('password') as string
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Invalid reset link' }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Password updated successfully!' }
}
```

**Why:** Secure password reset flow prevents account takeover. Always validate reset tokens server-side.

---

### Pattern 30: Identity Linking (Link Multiple Auth Providers)

**When to use:** Users want to link Google, GitHub, email to same account

**Implementation:**

```tsx
// ✅ CORRECT - Link additional provider to existing account
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export function LinkProvider() {
  const linkGoogleAccount = async () => {
    const { data, error } = await supabase.auth.linkIdentity({
      provider: 'google',
    })

    if (error) {
      console.error('Linking error:', error.message)
      return
    }

    // User redirected to Google OAuth
    // After success, Google account linked to current user
  }

  const unlinkProvider = async (identityId: string) => {
    const { error } = await supabase.auth.unlinkIdentity({
      identity_id: identityId,
    })

    if (error) {
      console.error('Unlink error:', error.message)
      return
    }

    console.log('Provider unlinked successfully')
  }

  return (
    <div>
      <button onClick={linkGoogleAccount}>Link Google Account</button>
    </div>
  )
}
```

**Why:** Identity linking allows users to sign in with multiple providers (email, Google, GitHub) for same account. Improves flexibility and account recovery options.

---

## Security Hardening Checklist

### OWASP Compliance

- [ ] **Authentication**
  - [ ] Enable MFA for admin accounts
  - [ ] Implement rate limiting on auth endpoints
  - [ ] Use strong password policies (min 12 chars, complexity)
  - [ ] Enable email verification
  - [ ] Implement account lockout after failed attempts

- [ ] **Session Management**
  - [ ] Enable refresh token rotation
  - [ ] Configure session timeboxing (24h max)
  - [ ] Configure inactivity timeout (1h)
  - [ ] Use HTTP-only, Secure, SameSite cookies
  - [ ] Implement session revocation on logout

- [ ] **Authorization**
  - [ ] Enable RLS on all tables
  - [ ] Use `auth.uid()` in RLS policies (cached with subselect)
  - [ ] Enforce MFA with AAL2 for sensitive data
  - [ ] Implement RBAC with Custom Access Token Hook
  - [ ] Use `restrictive` policies for defense in depth

- [ ] **Input Validation**
  - [ ] Validate all inputs with Zod schemas
  - [ ] Sanitize user-generated content
  - [ ] Use parameterized queries (Supabase handles this)
  - [ ] Implement CSRF protection

- [ ] **Data Protection**
  - [ ] Never expose service role key on client
  - [ ] Encrypt sensitive data at rest
  - [ ] Use HTTPS only (enforced by Supabase)
  - [ ] Implement data retention policies
  - [ ] Enable audit logging

- [ ] **Monitoring and Logging**
  - [ ] Log failed login attempts
  - [ ] Monitor for suspicious activity
  - [ ] Set up alerts for security events
  - [ ] Track MFA enrollment/usage
  - [ ] Log sensitive operations (password changes, deletions)

---

## Production Patterns

### Device Management and Session Revocation

```tsx
// ✅ CORRECT - List active sessions (requires custom implementation)
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const supabase = createClient()

export function ActiveSessions() {
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    // Query custom sessions table (you need to create this)
    const { data } = await supabase
      .from('user_sessions')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setSessions(data)
    }
  }

  const revokeSession = async (sessionId: string) => {
    // Implement session revocation
    await supabase.from('user_sessions').delete().eq('id', sessionId)

    loadSessions()
  }

  return (
    <div>
      <h2>Active Devices</h2>
      {sessions.map((session) => (
        <div key={session.id}>
          <p>{session.device_name}</p>
          <p>{session.ip_address}</p>
          <p>Last active: {new Date(session.last_active).toLocaleString()}</p>
          <button onClick={() => revokeSession(session.id)}>Revoke</button>
        </div>
      ))}
    </div>
  )
}
```

**Session Tracking Table:**

```sql
-- ✅ CORRECT - Custom session tracking for device management
create table public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  device_name text,
  device_type text, -- mobile, desktop, tablet
  ip_address inet,
  user_agent text,
  last_active timestamptz default now(),
  created_at timestamptz default now()
);

-- RLS policies
alter table public.user_sessions enable row level security;

create policy "Users view own sessions"
  on public.user_sessions
  for select
  using (user_id = auth.uid());

create policy "Users delete own sessions"
  on public.user_sessions
  for delete
  using (user_id = auth.uid());
```

---

## Detection Commands

```bash
# Find server-side code using getSession() instead of getUser()
rg "auth\.getSession\(\)" --type ts --type tsx \
  -g '!**/client.ts' -g '!**/*.client.tsx' -g '!app/**/page.tsx'

# Find Server Actions missing auth guards
rg "'use server'" --type ts -A 20 \
  | grep -v "auth.getUser()" \
  | grep -v "auth.getClaims()"

# Find proxy/middleware not calling getUser()
rg "createServerClient" proxy.ts middleware.ts lib/supabase/middleware.ts \
  | xargs -I{} sh -c "grep -L 'auth.getUser()' {}"

# Find protected routes not using redirect()
rg "if \(!user\)" --type tsx -A 2 \
  | grep -v "redirect\("

# Find client components creating new Supabase clients (not singleton)
rg "const supabase = createClient\(\)" --type tsx \
  -g '!**/lib/supabase/*.ts'

# Find RLS policies not using auth.uid()
psql $DATABASE_URL -c "
  SELECT schemaname, tablename, policyname, definition
  FROM pg_policies
  WHERE definition NOT LIKE '%auth.uid()%'
    AND definition NOT LIKE '%auth.jwt()%';
"

# Find Server Components with queries before auth checks
rg "from\('.*'\)\.select" --type tsx -B 5 \
  | grep -B 5 "auth.getUser()" \
  | grep "from\('.*'\)"

# Find auth state change listeners without cleanup
rg "onAuthStateChange" --type tsx -A 10 \
  | grep -v "subscription.unsubscribe()"

# Find OAuth redirectTo using relative URLs
rg "signInWithOAuth" --type tsx -A 5 \
  | grep "redirectTo:" \
  | grep -v "NEXT_PUBLIC_APP_URL"

# Find deprecated auth.email() in RLS policies (NEW - check for deprecated pattern)
psql $DATABASE_URL -c "
  SELECT schemaname, tablename, policyname, definition
  FROM pg_policies
  WHERE definition LIKE '%auth.email()%';
"

# Find manual refreshSession() calls (should be handled by proxy/middleware)
rg "refreshSession\(\)" --type ts --type tsx \
  -g '!**/proxy.ts' -g '!**/middleware.ts'

# Find deprecated method names (login, signup, logout instead of signIn, signUp, signOut)
rg "auth\.(login|signup|logout)\(" --type ts --type tsx

# Find sensitive operations without reauthentication nonce
rg "auth\.updateUser\(" --type ts -B 5 -A 5 \
  | grep -v "nonce"

# Find password updates without nonce (security risk)
rg "password.*updateUser" --type ts -A 3 \
  | grep -v "nonce"

# Check for MFA enforcement in sensitive tables
psql $DATABASE_URL -c "
  SELECT schemaname, tablename, policyname, definition
  FROM pg_policies
  WHERE tablename IN ('transactions', 'payment_methods', 'user_profiles')
    AND definition NOT LIKE '%aal%';
"

# Find code using MFA API without error handling
rg "auth\.mfa\.(enroll|challenge|verify|listFactors|unenroll)" --type ts --type tsx -A 3 \
  | grep -v "error"

# Find anonymous sign-in without is_anonymous check in RLS
psql $DATABASE_URL -c "
  SELECT schemaname, tablename, policyname, definition
  FROM pg_policies
  WHERE definition LIKE '%auth.jwt()%'
    AND definition NOT LIKE '%is_anonymous%';
"

# Find Custom Access Token Hook usage without proper grants
psql $DATABASE_URL -c "
  SELECT routine_name, routine_schema
  FROM information_schema.routines
  WHERE routine_name LIKE '%access_token_hook%'
    AND specific_schema = 'public';
"

# Find rate limiting missing on auth operations
rg "signInWithPassword|signUp|resetPasswordForEmail" --type ts -B 5 \
  | grep -v "rateLimit"

# Find account enumeration risks (specific error messages)
rg "already registered|email exists|user not found" --type ts --type tsx

# Find missing email verification checks
psql $DATABASE_URL -c "
  SELECT schemaname, tablename, policyname, definition
  FROM pg_policies
  WHERE definition NOT LIKE '%email_confirmed_at%'
    AND tablename IN ('appointments', 'bookings', 'orders');
"

# Find GDPR data deletion without audit logging
rg "deleteUser|delete_user_data" --type ts --type sql -A 5 \
  | grep -v "audit|log"

# Find magic link/OTP usage without NEXT_PUBLIC_APP_URL
rg "signInWithOtp|signInWithSSO|signInWithOAuth" --type ts --type tsx -A 3 \
  | grep -v "NEXT_PUBLIC_APP_URL"

# Find identity linking without proper error handling
rg "linkIdentity|unlinkIdentity" --type ts --type tsx -A 3 \
  | grep -v "error"

# Find session tracking table without RLS
psql $DATABASE_URL -c "
  SELECT tablename
  FROM pg_tables
  WHERE tablename LIKE '%session%'
    AND schemaname = 'public'
    AND rowsecurity = false;
"

# Find SAML SSO usage on non-Pro plans (will fail at runtime)
rg "signInWithSSO" --type ts --type tsx

# Find Node.js 18 usage (EOL April 2025)
node --version | grep "v18\."
```

---

## Quick Reference

| Context | Client Type | Auth Method | Verification | Use Case | Since |
|---------|-------------|-------------|--------------|----------|-------|
| Server Component | `createClient()` (server) | `getUser()` | JWT verified | Protected pages, data fetching | v1.0 |
| Server Action | `createClient()` (server) | `getUser()` | JWT verified | Mutations, form submissions | v1.0 |
| Route Handler | `createClient()` (server) | `getUser()` | JWT verified | API endpoints | v1.0 |
| Middleware | `createServerClient` | `getUser()` | JWT verified | Session refresh, route protection | v1.0 |
| Client Component | `createClient()` (client) | `getSession()` | No verification | UI display, subscriptions | v1.0 |
| Server (fast) | `createClient()` (server) | `getClaims()` | Web Crypto API | Performance-critical server checks | v2.0+ |
| Sensitive ops | `createClient()` (server) | `reauthenticate()` | Nonce verification | Password changes, account deletion | 2024+ |

| Pattern | Trigger | Example | Since |
|---------|---------|---------|-------|
| Session refresh | Middleware runs | `await supabase.auth.getUser()` | v1.0 |
| Protected route | Unauthenticated user | `if (!user) redirect('/login')` | v1.0 |
| RLS query | Fetch user data | `eq('user_id', user.id)` | v1.0 |
| Sign out | User action | `await supabase.auth.signOut()` + `revalidatePath()` | v2.0 |
| OAuth login | Social sign-in | `signInWithOAuth({ provider: 'google', options: { redirectTo } })` | v2.0 |
| Reauthentication | Password change | `await supabase.auth.reauthenticate()` → `updateUser({ password, nonce })` | 2024+ |
| Token rotation | Security enhancement | Enable `GOTRUE_SECURITY_REFRESH_TOKEN_ROTATION_ENABLED` | 2024+ |
| Session timeout | Inactivity logout | Configure `GOTRUE_SESSIONS_INACTIVITY_TIMEOUT` | 2024+ |
| MFA TOTP | Enhanced security | `auth.mfa.enroll({ factorType: 'totp' })` → `auth.mfa.verify()` | 2024+ |
| MFA Phone | SMS/WhatsApp MFA | `auth.mfa.enroll({ factorType: 'phone', phone })` | 2024+ |
| Anonymous Sign-In | Guest users | `auth.signInAnonymously()` → later link with `updateUser()` | 2024+ |
| Custom JWT Claims | RBAC/Multi-tenant | Create `custom_access_token_hook()` function → enable in Dashboard | 2024+ |
| Magic Link | Passwordless | `auth.signInWithOtp({ email })` → one-time link | v2.0 |
| Email OTP | Passwordless | `auth.signInWithOtp({ email })` → `auth.verifyOtp({ token })` | v2.0 |
| Enterprise SSO | SAML 2.0 | `auth.signInWithSSO({ domain })` → redirect to IdP | 2024+ |
| Identity Linking | Multiple providers | `auth.linkIdentity({ provider: 'google' })` | 2024+ |
| Account Deletion | GDPR compliance | `auth.admin.deleteUser()` + data export + audit log | 2024+ |
| Email Verification | Spam prevention | `auth.resend({ type: 'signup', email })` | v2.0 |
| Password Reset | Account recovery | `auth.resetPasswordForEmail()` → `updateUser({ password })` | v2.0 |

### JWT Claims Quick Reference

| Claim | Type | Description | Example | Use Case |
|-------|------|-------------|---------|----------|
| `sub` | UUID | User ID (same as auth.uid()) | `f47ac10b-...` | User identification |
| `email` | string | User email address | `user@example.com` | Email-based policies |
| `phone` | string | User phone number | `+1234567890` | Phone-based auth |
| `role` | string | User role | `authenticated`, `admin` | Role-based access |
| `aal` | string | Authenticator Assurance Level | `aal1`, `aal2` | MFA enforcement |
| `amr` | array | Authentication Method References | `[{method: "password"}, {method: "totp"}]` | Auth method checks |

### Security Configuration Quick Reference

| Setting | Default | Recommended | Purpose |
|---------|---------|-------------|---------|
| `GOTRUE_SECURITY_REFRESH_TOKEN_ROTATION_ENABLED` | `false` | `true` | Prevent token theft |
| `GOTRUE_SECURITY_REFRESH_TOKEN_REUSE_INTERVAL` | `0` | `10` | Grace period (seconds) |
| `GOTRUE_SESSIONS_TIMEBOX` | `0` (disabled) | `86400` (24h) | Absolute session limit |
| `GOTRUE_SESSIONS_INACTIVITY_TIMEOUT` | `0` (disabled) | `3600` (1h) | Auto-logout on idle |
| `GOTRUE_SESSIONS_SINGLE_PER_USER` | `false` | `false` | Allow concurrent sessions |
| `GOTRUE_JWT_EXP` | `3600` | `3600` (1h) | Access token TTL |

---

## Common Pitfalls

### Critical Security Issues

1. **Random Logouts:** Running code between `createServerClient` and `auth.getUser()` in proxy/middleware
2. **Session Desync:** Not returning original `supabaseResponse` from proxy/middleware
3. **RLS Leaks:** Using `getSession()` for server-side authorization (JWT not verified)
4. **Token Theft:** Not enabling refresh token rotation in production environments
5. **Security Risk:** Password changes without reauthentication nonce (allows session hijacking)
6. **Account Enumeration:** Specific error messages revealing if accounts exist
7. **No MFA Enforcement:** Sensitive financial/medical data accessible with AAL1
8. **Missing Rate Limiting:** Auth endpoints vulnerable to brute force attacks

### Implementation Errors

9. **Memory Leaks:** Not unsubscribing from `onAuthStateChange`
10. **Cookie Errors:** Not wrapping `cookieStore.set()` in try/catch
11. **Stale Data:** Not calling `revalidatePath()` after auth state changes
12. **Client Duplication:** Creating multiple Supabase clients in client components
13. **Method Name Errors:** Using deprecated `login()`, `signup()`, `logout()` (removed in v2+)
14. **Manual Refresh:** Calling `refreshSession()` manually (breaks token rotation security)

### Performance Issues

15. **Uncached auth.uid():** Calling `auth.uid()` per row instead of caching with subselect
16. **Large JWTs:** Not using Custom Access Token Hook to reduce JWT size for SSR
17. **Slow Validation:** Using `getUser()` when `getClaims()` would suffice (Web Crypto API faster)

### Deprecated Patterns

18. **Deprecated Functions:** Using `auth.email()` in RLS policies (use `auth.jwt() ->> 'email'` instead)
19. **Old API Methods:** Using `auth.session()` instead of `auth.getSession()`
20. **Abandoned Sessions:** Not configuring inactivity timeouts for sensitive applications

### Compliance Violations

21. **GDPR Non-Compliance:** Account deletion without data export or audit trail
22. **Missing Verification:** Not requiring email verification for sensitive operations
23. **No Audit Logging:** Not tracking sensitive operations (deletions, password changes)
24. **Data Retention:** Not implementing retention policies or anonymization

### Platform Issues

25. **Node.js 18 EOL:** Using Node.js 18 after April 30, 2025 (upgrade to 20+)
26. **SSO on Free Plan:** Attempting SAML SSO without Pro plan (will fail)
27. **Missing Absolute URLs:** OAuth/Magic Link `redirectTo` using relative paths (fails in production)

---

**Related Files:**
- `05-database.md` - RLS policies with `auth.uid()` and `auth.jwt()`
- `06-api.md` - Server Actions with auth guards
- `04-nextjs.md` - Middleware patterns
- `07-forms.md` - Auth forms with Zod validation

---

## Migration Guide

### Migrating from Deprecated Patterns

#### 1. Update deprecated RLS auth.email() function

```sql
-- BEFORE (deprecated since 2024)
create policy "Users view own profile"
  on profiles for select
  using (auth.email() = email);

-- AFTER (recommended)
create policy "Users view own profile"
  on profiles for select
  using ((auth.jwt() ->> 'email') = email);
```

#### 2. Update deprecated auth method names (if using v1.x)

```ts
// BEFORE (removed in v2+)
await supabase.auth.login({ email, password })
await supabase.auth.signup({ email, password })
await supabase.auth.logout()

// AFTER (current)
await supabase.auth.signIn({ email, password })
await supabase.auth.signUp({ email, password })
await supabase.auth.signOut()
```

#### 3. Remove manual refreshSession() calls

```ts
// BEFORE (breaks token rotation)
useEffect(() => {
  const interval = setInterval(() => {
    supabase.auth.refreshSession()
  }, 50000)
  return () => clearInterval(interval)
}, [])

// AFTER (proxy/middleware handles automatically)
// Remove the manual refresh entirely - proxy/middleware does this
```

#### 4. Add reauthentication for sensitive operations

```ts
// BEFORE (security risk)
export async function updatePassword(password: string) {
  await supabase.auth.updateUser({ password })
}

// AFTER (secure with nonce)
export async function updatePassword(password: string, nonce: string) {
  await supabase.auth.updateUser({ password, nonce })
}
```

---

---

## Ultra-Deep Analysis Changelog (2025-11-03)

### What Changed

This update represents a comprehensive expansion from 16 patterns to **30 enterprise-grade patterns**, adding advanced authentication, security hardening, and compliance capabilities.

### New Patterns Added (14 New Patterns)

**Enterprise Features:**
- **Pattern 17:** Multi-Factor Authentication (MFA) - TOTP Setup
- **Pattern 18:** Enforce MFA with RLS Policies (AAL2 enforcement)
- **Pattern 19:** Phone-Based MFA (SMS/WhatsApp)
- **Pattern 20:** List and Unenroll MFA Factors (device management)
- **Pattern 21:** Anonymous Sign-In (guest users with data persistence)
- **Pattern 22:** Custom Access Token Hook (RBAC with JWT Claims)
- **Pattern 23:** Passwordless Magic Link Authentication
- **Pattern 24:** Enterprise SSO with SAML 2.0 (Pro Plans+)
- **Pattern 30:** Identity Linking (link multiple auth providers)

**Security Hardening:**
- **Pattern 25:** Security Hardening - Rate Limiting and Brute Force Protection
- **Pattern 26:** Account Enumeration Prevention

**Compliance & Account Management:**
- **Pattern 27:** GDPR Compliance - Account Deletion and Data Export
- **Pattern 28:** Email and Phone Verification
- **Pattern 29:** Account Recovery and Password Reset

**Production Patterns:**
- Device Management and Session Revocation (custom session tracking)

### Major Sections Added

1. **Security Hardening Checklist** - OWASP compliance checklist with 30+ security controls
2. **Production Patterns** - Device management, session revocation, security monitoring
3. **Extended Detection Commands** - 15+ new commands for security auditing
4. **Expanded Common Pitfalls** - Categorized into 27 specific pitfalls across:
   - Critical Security Issues (8)
   - Implementation Errors (6)
   - Performance Issues (3)
   - Deprecated Patterns (3)
   - Compliance Violations (4)
   - Platform Issues (3)

### Version Updates

**Breaking Changes Documented:**
- Node.js 18 EOL (April 30, 2025) - upgrade to Node.js 20+ required by October 31, 2025
- @supabase/ssr 0.7.0 - updated cookie library (1.0.2), minor internal type changes
- auth-js monorepo consolidation (archive scheduled October 10, 2025)

**Stack Versions Updated:**
- Supabase JS: `2.47.15+` (latest: `2.78+`)
- @supabase/ssr: `0.6.1+` → `0.7.0+`
- Next.js: `15+` → `16+`
- Node.js: Added `20+` requirement

### Features Highlighted

**New Auth Capabilities:**
- MFA support: TOTP (App Authenticator), Phone (SMS/WhatsApp), WebAuthn
- Anonymous sign-in with account linking
- Custom JWT claims via Auth Hooks
- Enterprise SSO with SAML 2.0
- Identity linking (multiple providers per account)

**Security Enhancements:**
- Refresh token rotation (prevents token theft)
- Session timeboxing and inactivity timeouts
- AAL-based MFA enforcement in RLS
- Rate limiting patterns
- Account enumeration prevention
- PKCE flow for OAuth

**Compliance Features:**
- GDPR-compliant account deletion
- Data portability (export user data)
- Audit logging for sensitive operations
- Email/phone verification flows
- Retention policies and anonymization

### Documentation Improvements

**Quick Reference Tables Expanded:**
- Added 13 new auth patterns with version tags
- Expanded JWT Claims reference with `is_anonymous`, custom claims
- Added Security Configuration reference table
- Documented MFA API methods and limits

**Detection Commands Enhanced:**
- Original: 12 detection commands
- Updated: 25+ detection commands
- New checks for: MFA enforcement, anonymous users, Custom Access Token Hooks, rate limiting, account enumeration, GDPR compliance, email verification, identity linking, session RLS, Node.js version

**Code Examples:**
- Original: 16 patterns with examples
- Updated: 30 patterns with comprehensive examples
- All examples include:
  - ✅ CORRECT implementations
  - ❌ WRONG anti-patterns
  - Configuration notes
  - Security considerations
  - Why sections explaining rationale

### Migration Recommendations

**Immediate Actions:**
1. **Upgrade Node.js** - If using Node.js 18, plan upgrade to 20+ by October 31, 2025
2. **Enable MFA** - For admin accounts and sensitive operations (see Pattern 17-18)
3. **Enable Token Rotation** - Set `GOTRUE_SECURITY_REFRESH_TOKEN_ROTATION_ENABLED=true`
4. **Configure Session Timeouts** - Set `GOTRUE_SESSIONS_INACTIVITY_TIMEOUT` for sensitive apps
5. **Run Detection Commands** - Audit codebase for security issues using expanded command set

**Security Hardening (Recommended):**
1. Review OWASP Compliance Checklist (30+ controls)
2. Implement rate limiting on auth endpoints (Pattern 25)
3. Add account enumeration prevention (Pattern 26)
4. Enforce MFA for sensitive data with AAL2 RLS policies (Pattern 18)
5. Enable email verification for production (Pattern 28)

**Compliance (If Serving EU Users):**
1. Implement GDPR-compliant deletion flow (Pattern 27)
2. Add data export capability
3. Set up audit logging for sensitive operations
4. Review data retention policies

**Enterprise Features (Optional):**
1. Evaluate MFA for enhanced security (Patterns 17-20)
2. Consider Custom Access Token Hooks for RBAC (Pattern 22)
3. Enable Enterprise SSO if on Pro plan (Pattern 24)
4. Implement anonymous sign-in for guest experiences (Pattern 21)

### Files Cross-Referenced

Updated references to related documentation:
- `05-database.md` - RLS policies with `auth.uid()` and `auth.jwt()`
- `06-api.md` - Server Actions with auth guards
- `04-nextjs.md` - Middleware patterns
- `07-forms.md` - Auth forms with Zod validation

### Testing Recommendations

1. **Run all detection commands** on existing codebase
2. **Test MFA enrollment** in development environment
3. **Verify token rotation** behavior with session refresh
4. **Test account deletion** flow with data export
5. **Validate email verification** prevents unverified access
6. **Check rate limiting** stops brute force attempts
7. **Confirm RLS policies** enforce MFA for sensitive tables

### Next Review Suggested

**Quarterly Review Recommended:**
- Check for Supabase Auth updates every 3 months
- Monitor for new security features
- Review OWASP Top 10 changes
- Update MFA adoption metrics
- Audit compliance logs

**Triggers for Immediate Review:**
- Major Supabase JS version releases (3.x)
- Security advisories from Supabase
- Compliance regulation changes (GDPR updates)
- Platform incidents or breaches

---

**Last Updated:** 2025-11-03 (Supabase JS 2.47.15+, @supabase/ssr 0.7.0+, Supabase Auth latest, Node.js 20+)
