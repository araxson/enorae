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

| Strategy | Tool | Context |
|----------|------|---------|
| **Immediate read-your-writes** | `updateTag('tag')` | Server Actions only. Next request blocks until data is refetched. |
| **On-demand revalidation** | `revalidateTag('tag')` | Route Handlers and Server Actions. Triggers next request to refresh lazily. |
| **Background revalidation** | `revalidateTag('tag', 'max')` | Stale-while-revalidate pattern for soft refreshes. |
| **Path invalidation** | `revalidatePath('/path')` | Invalidate all data for a page segment. |
| **Client refresh** | `refresh()` | Re-fetch the current page from a Server Action. |
| **Time-based TTL** | `export const revalidate = 60` | Automatically revalidate on interval. |
| **Ahead-of-time tagging** | `'use cache'` + `cacheTag('tag')` | Tag cached functions for later invalidation. |
| **Client router cache** | `experimental.staleTimes` | Opt segments into client router cache freshness windows. |

> ⚠️ `updateTag` **only works inside Server Actions**. It throws in Route Handlers—use `revalidateTag(tag, 'max')` there (Next.js v15 docs). 

### Examples

```ts
// Read-your-writes (Server Action only)
const { data } = await supabase
  .from('appointments')
  .insert(...)
  .select()
  .single()
updateTag('appointments')
updateTag(`appointment-${data.id}`)
redirect(`/appointments/${data.id}`)

// Route handler / background invalidation
await supabase.from('appointments').update(...)
revalidateTag('appointments', 'max')  // Stale-while-revalidate

// Path invalidation
await bulkUpdate()
revalidatePath('/dashboard')
```

```ts
// Tag cached functions for granular invalidation
import { cacheTag } from 'next/cache'

export async function getDashboard() {
  'use cache'
  cacheTag('dashboard')
  return queryDashboard()
}
```

```js
// Opt segments into the client router cache (next.config.js)
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
}

module.exports = nextConfig
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

### Feature Structure

```
features/business/appointments/
├── api/
│   ├── queries.ts         # Server-only reads (public views)
│   └── mutations.ts       # Server actions (schema tables)
├── components/
│   ├── appointment-list.tsx
│   ├── appointment-form.tsx
│   └── appointment-skeleton.tsx
├── schema.ts              # Zod validation
├── types.ts               # Type aliases
└── index.tsx              # Feature entry
```

### Complete Implementation

**1. Types (`types.ts`):**
```ts
import type { Database } from '@/lib/types/database.types'

export type AppointmentRow = Database['public']['Views']['appointments_view']['Row']
export type AppointmentInsert = Database['scheduling']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['scheduling']['Tables']['appointments']['Update']
```

**2. Schemas (`schema.ts`):**
```ts
import { z } from 'zod'

export const createAppointmentSchema = z.object({
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  durationMinutes: z.coerce.number().min(15).max(480),
  notes: z.string().max(500).optional(),
})

export const updateAppointmentSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  notes: z.string().max(500).optional(),
})
```

**3. Queries (`api/queries.ts`):**
```ts
import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { AppointmentRow } from '../types'

const getSupabase = cache(async () => createClient())

export async function getAppointments(businessId: string): Promise<AppointmentRow[]> {
  const supabase = await getSupabase()

  // ✅ Always verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ✅ Query from public view
  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('business_id', businessId)
    .eq('user_id', user.id)  // ✅ Filter by tenant
    .order('scheduled_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getAppointmentById(id: string): Promise<AppointmentRow> {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments_view')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) throw error
  return data
}
```

**4. Mutations (`api/mutations.ts`):**
```ts
'use server'  // ✅ REQUIRED first line

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAppointmentSchema, updateAppointmentSchema } from '../schema'

export async function createAppointment(input: unknown) {
  const supabase = await createClient()

  // ✅ 1. Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ✅ 2. Validate input with Zod
  const payload = createAppointmentSchema.parse(input)

  // ✅ 3. Write to schema table
  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({
      ...payload,
      business_id: user.id,  // ✅ Add tenant scope
    })
    .select()
    .single()

  if (error) throw error

  // ✅ 4. Cache invalidation (immediate consistency)
  updateTag(`appointment:${data.id}`)
  updateTag('appointments')
  updateTag(`appointments:${user.id}`)

  // ✅ 5. Revalidate path
  revalidatePath('/business/appointments')

  // ✅ 6. Redirect (must be last - it throws)
  redirect(`/business/appointments/${data.id}`)
}

export async function updateAppointmentStatus(input: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const payload = updateAppointmentSchema.parse(input)

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update({
      status: payload.status,
      notes: payload.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.id)
    .eq('business_id', user.id)  // ✅ Tenant scoped

  if (error) throw error

  // ✅ Update only affected caches
  updateTag(`appointment:${payload.id}`)
  updateTag(`appointments:${user.id}`)

  revalidatePath(`/business/appointments/${payload.id}`)
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('business_id', user.id)

  if (error) throw error

  // ✅ Clear all related caches
  updateTag(`appointment:${id}`)
  updateTag('appointments')
  updateTag(`appointments:${user.id}`)

  revalidatePath('/business/appointments')
  redirect('/business/appointments')
}
```

**5. Components (`components/appointment-form.tsx`):**
```tsx
'use client'

import { useActionState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createAppointmentSchema } from '../schema'
import { createAppointment } from '../api/mutations'

export function AppointmentForm() {
  const form = useForm({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      customerId: '',
      serviceId: '',
      staffId: '',
      scheduledAt: '',
      durationMinutes: 60,
      notes: '',
    },
  })

  return (
    <Form {...form}>
      <form action={createAppointment} className="space-y-4">
        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional fields... */}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Creating...' : 'Create Appointment'}
        </Button>
      </form>
    </Form>
  )
}
```

**6. Feature Entry (`index.tsx`):**
```tsx
import { Suspense } from 'react'
import { getAppointments } from './api/queries'
import { AppointmentList } from './components/appointment-list'
import { AppointmentSkeleton } from './components/appointment-skeleton'

export async function AppointmentsFeature(props: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await props.params  // ✅ Await params
  const appointments = await getAppointments(businessId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
        {/* Add create button */}
      </div>

      <Suspense fallback={<AppointmentSkeleton />}>
        <AppointmentList appointments={appointments} />
      </Suspense>
    </div>
  )
}
```

**7. Page Shell (`app/(business)/appointments/page.tsx`):**
```tsx
import { Suspense } from 'react'
import { AppointmentsFeature } from '@/features/business/appointments'
import { AppointmentSkeleton } from '@/features/business/appointments/components/appointment-skeleton'

export default async function Page(props: { params: Promise<{ businessId: string }> }) {
  return (
    <Suspense fallback={<AppointmentSkeleton />}>
      <AppointmentsFeature {...props} />
    </Suspense>
  )
}
```

### Complete Flow

1. **User navigates** → Page renders (5-12 lines)
2. **Page** → Suspense wraps feature component
3. **Feature** → Calls `getAppointments()` query
4. **Query** → Verifies auth, queries view, returns data
5. **Feature** → Passes data to List component
6. **List** → Renders appointments
7. **User submits form** → Calls `createAppointment()` mutation
8. **Mutation** → Verifies auth, validates, writes to schema table
9. **Mutation** → Updates cache tags, revalidates path
10. **Mutation** → Redirects to detail page
11. **Detail page** → Fetches fresh data (cache invalidated)
12. **User sees** → New appointment immediately

---

**Last Updated:** 2025-10-21 (Enhanced with complete end-to-end feature example)
**Next.js Version:** 15.5.4 (params as promises, `updateTag` and `revalidateTag` improvements)
