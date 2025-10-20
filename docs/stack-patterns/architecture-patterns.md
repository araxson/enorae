# Architecture Patterns - ENORAE

**Essential architectural rules for feature-based organization in Next.js 15.**

---

## Quick Reference

| What you need | Where to look |
|---------------|---------------|
| **Feature structure** | [Feature Folder Structure](#feature-folder-structure) |
| **Server/client rules** | [Critical Rules](#critical-rules) |
| **Auth patterns** | [Auth & Security](#auth--security) |
| **Caching** | [Cache Strategies](#cache-strategies) |
| **Detection commands** | [Detection Commands](#detection-commands) |

---

## Stack

- **Next.js:** 15.5.4 (App Router)
- **React:** 19.1.0 (Server/Client Components)
- **TypeScript:** 5.9.3 (Strict mode)
- **Supabase:** 2.47.15 (`@supabase/ssr`)

---

## 🚨 Critical Rules - MUST FOLLOW

### 1. Pages Are Thin Shells (5-12 Lines)

```tsx
// ✅ CORRECT - Thin shell
import { Suspense } from 'react'
import { AppointmentsFeature } from '@/features/business/appointments'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <AppointmentsFeature {...props} />
    </Suspense>
  )
}

// ❌ FORBIDDEN - Business logic in page
export default async function Page() {
  const supabase = await createClient()  // ❌ NO
  const data = await supabase.from...    // ❌ NO
  return <div>{data}</div>               // ❌ NO
}
```

### 2. Always Use getUser() for Auth (NEVER getSession())

```tsx
// ✅ CORRECT
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')

// ❌ FORBIDDEN - getSession() can be spoofed
const { data: { session } } = await supabase.auth.getSession()  // ❌ INSECURE
```

### 3. Middleware ONLY Refreshes Sessions

```ts
// ✅ CORRECT - Only session refresh
export async function middleware(request: NextRequest) {
  return updateSession(request)  // Just refreshes tokens
}

// ❌ FORBIDDEN - Auth checks in middleware
export async function middleware(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser()  // ❌ NO
  if (!user) return redirect('/login')                      // ❌ NO
}
```

**Do auth checks in Server Components/Route Handlers instead.**

### 4. Server Directives Required

```ts
// queries.ts - MUST have server-only
import 'server-only'  // ✅ REQUIRED

// mutations.ts - MUST start with 'use server'
'use server'  // ✅ REQUIRED (first line)

// Client components - MUST have 'use client'
'use client'  // ✅ REQUIRED (for hooks/events)
```

### 5. Params in Next.js 15 Are Promises

```tsx
// ✅ CORRECT - Await params
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params  // ✅ Await the promise
  return <Feature id={id} />
}

// ❌ FORBIDDEN - Direct access
export default async function Page({ params }: { params: { id: string } }) {
  return <Feature id={params.id} />  // ❌ Runtime error
}
```

---

## Feature Folder Structure

```
features/
└── {portal}/                     # customer | staff | business | admin
    └── {feature}/
        ├── api/
        │   ├── queries.ts        # ✅ Must: import 'server-only'
        │   └── mutations.ts      # ✅ Must: 'use server'
        ├── components/           # UI components (server/client)
        ├── schema.ts             # Zod validation schemas
        ├── types.ts              # TypeScript type aliases
        └── index.tsx             # Feature entry (Server Component)
```

**Rules:**
- `api/queries.ts` → Server-only reads from **public views**
- `api/mutations.ts` → Server actions writing to **schema tables**
- `components/` → Mix of server/client as needed
- `index.tsx` → Server Component shell, exports main feature

---

## File Patterns

### queries.ts - Server-Only Reads

```ts
import 'server-only'  // ✅ REQUIRED
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

const getSupabase = cache(async () => createClient())

export async function getAppointments(businessId: string) {
  const supabase = await getSupabase()

  // ✅ ALWAYS use getUser() to validate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments_view')  // ✅ Query PUBLIC VIEWS
    .select('*')
    .eq('business_id', businessId)
    .eq('user_id', user.id)  // ✅ Filter by user

  if (error) throw error
  return data
}
```

**Rules:**
- ✅ Import `'server-only'` first line
- ✅ Use `getUser()` for auth (never `getSession()`)
- ✅ Query from **public views** only
- ✅ Filter by `user.id` for multi-tenancy
- ✅ Wrap `createClient()` with `cache()`

### mutations.ts - Server Actions

```ts
'use server'  // ✅ REQUIRED (first line)

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAppointmentSchema } from '../schema'

export async function createAppointment(input: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ✅ Validate with Zod
  const payload = createAppointmentSchema.parse(input)

  // ✅ Write to SCHEMA TABLES
  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({ ...payload, business_id: user.id })
    .select()
    .single()

  if (error) throw error

  // ✅ Cache invalidation
  revalidateTag('appointments')
  revalidatePath('/business/appointments')

  // ✅ redirect() throws, so must be last
  redirect(`/business/appointments/${data.id}`)
}
```

**Rules:**
- ✅ First line: `'use server'`
- ✅ Parse input with Zod
- ✅ Use `getUser()` for auth
- ✅ Write to **schema tables** via `.schema('name')`
- ✅ Call `revalidateTag()` or `revalidatePath()`
- ✅ `redirect()` must be last (it throws)

### types.ts - Type Aliases

```ts
import type { Database } from '@/lib/types/database.types'

export type AppointmentRow = Database['public']['Views']['appointments_view']['Row']
export type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
```

**Rules:**
- ✅ Use generated Supabase types
- ❌ Never hand-write database types

### schema.ts - Zod Validation

```ts
import { z } from 'zod'

export const createAppointmentSchema = z.object({
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
})
```

**Rules:**
- ✅ Validate all network boundaries
- ✅ Use `.transform()` for type coercion

### index.tsx - Feature Entry

```tsx
import { Suspense } from 'react'
import { getAppointments } from './api/queries'
import { AppointmentList } from './components/appointment-list'

export async function AppointmentsFeature(props: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await props.params  // ✅ Await params
  const appointments = await getAppointments(businessId)

  return (
    <Suspense fallback={<Skeleton />}>
      <AppointmentList appointments={appointments} />
    </Suspense>
  )
}
```

**Rules:**
- ✅ Server Component (async)
- ✅ Await `params` promise
- ✅ Wrap in `Suspense`

---

## Auth & Security

### ✅ CORRECT: Auth in Server Components

```tsx
// app/(business)/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <Dashboard userId={user.id} />
}
```

### ✅ CORRECT: Auth in Route Handlers

```ts
// app/api/appointments/route.ts
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('user_id', user.id)

  return NextResponse.json(data)
}
```

### ❌ FORBIDDEN: Auth in Middleware

```ts
// ❌ DO NOT DO THIS
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()  // ❌ NO

  if (!user) return redirect('/login')  // ❌ NO
}
```

**Why middleware should only refresh sessions:**
- 🔒 More secure (auth check per route)
- ⚡ Better performance (no middleware latency)
- 🎯 Explicit auth logic
- 🛠️ Easier to debug

### Middleware Pattern (Session Refresh Only)

```ts
// middleware.ts
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)  // Only refreshes tokens
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

```ts
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // ✅ Refreshes session (DO NOT add auth logic)
  await supabase.auth.getUser()

  return supabaseResponse
}
```

---

## Cache Strategies

| Strategy | Tool | When to use |
|----------|------|-------------|
| **Read-your-writes** | `revalidateTag('tag')` | Immediate cache expiration after create/update |
| **Background revalidation** | `revalidateTag('tag', 'max')` | Stale-while-revalidate pattern |
| **Path invalidation** | `revalidatePath('/path')` | Invalidate all data for a page |
| **Client refresh** | `refresh()` | Re-fetch current page (Server Actions only) |
| **Time-based** | `export const revalidate = 60` | TTL-based caching |

### Examples

```ts
// Read-your-writes (immediate)
const { data } = await supabase.from('appointments').insert(...)
revalidateTag('appointments')
revalidateTag(`appointment-${data.id}`)
redirect(`/appointments/${data.id}`)

// Background revalidation
await supabase.from('appointments').update(...)
revalidateTag('appointments', 'max')  // Stale-while-revalidate

// Path invalidation
await bulkUpdate()
revalidatePath('/dashboard')
```

**Tag naming conventions:**
- Collections: `'appointments'`, `'users'`
- Single resources: `'appointment-{id}'`, `'user-{id}'`

---

## Detection Commands

Run these before committing:

```bash
# 1. queries.ts missing 'server-only'
rg --files -g 'queries.ts' features | xargs -I{} sh -c "grep -L \"import 'server-only'\" {}"

# 2. mutations.ts missing 'use server'
rg --files -g 'mutations.ts' features | xargs -I{} sh -c "grep -L \"'use server'\" {}"

# 3. Client components missing 'use client'
rg "(useState|useEffect|useReducer)" features --type tsx | xargs -I{} sh -c "grep -L \"'use client'\" {}"

# 4. Params accessed without await
rg "params\." app --type tsx | grep -v "await params" | grep -v "use(params)"

# 5. Route handlers > 120 lines
find app/api -name 'route.ts' -exec sh -c 'lines=$(wc -l < "$1"); [ $lines -gt 120 ] && echo "$1: $lines lines"' _ {} \;

# 6. Pages > 12 lines
find app -name 'page.tsx' -exec sh -c 'lines=$(wc -l < "$1"); [ $lines -gt 12 ] && echo "$1: $lines lines"' _ {} \;
```

**Zero violations required before commit.**

---

## Pre-Commit Checklist

**Architecture:**
- [ ] Pages are 5-12 lines (thin shells only)
- [ ] `params` are awaited: `const { id } = await props.params`
- [ ] Features use generated types from `Database[...]`
- [ ] Client components declare `'use client'` and are minimal

**Server/Client Directives:**
- [ ] `queries.ts` has `import 'server-only'` first line
- [ ] `mutations.ts` starts with `'use server'` first line
- [ ] Client components with hooks have `'use client'`

**Auth & Security:**
- [ ] **CRITICAL:** All auth uses `getUser()`, never `getSession()`
- [ ] All queries filter by `user.id` for multi-tenancy
- [ ] **CRITICAL:** Middleware ONLY refreshes sessions, NO auth checks
- [ ] Auth checks are in Server Components/Route Handlers

**Database:**
- [ ] Queries read from **public views**
- [ ] Mutations write to **schema tables** via `.schema('name')`
- [ ] All inputs validated with Zod before database access

**Caching:**
- [ ] Mutations call `revalidateTag()` or `revalidatePath()`
- [ ] `redirect()` is last line (it throws)
- [ ] Cache tags are documented

**Quality:**
- [ ] All detection commands pass (zero matches)
- [ ] No business logic in pages or middleware
- [ ] Supabase clients created via shared helpers

---

## Complete Example

```
features/business/appointments/
├── api/
│   ├── queries.ts         # Server-only reads (public views)
│   └── mutations.ts       # Server actions (schema tables)
├── components/
│   ├── appointment-list.tsx
│   └── appointment-skeleton.tsx
├── schema.ts              # Zod validation
├── types.ts               # Type aliases
└── index.tsx              # Feature entry
```

**Page shell (app/(business)/appointments/page.tsx):**
```tsx
import { Suspense } from 'react'
import { AppointmentsFeature } from '@/features/business/appointments'
import { Skeleton } from '@/features/business/appointments/components/appointment-skeleton'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <AppointmentsFeature {...props} />
    </Suspense>
  )
}
```

---

**Last Updated:** 2025-10-20
**Next.js Version:** 15.5.4 (params as promises, `revalidateTag` improvements)
