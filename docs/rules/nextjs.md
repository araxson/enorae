# Next.js Patterns

**Standalone reference for Next.js 16 App Router patterns. No external dependencies.**

---

## Stack Context

- **Next.js:** 16.0.0 (App Router with Turbopack)
- **React:** 19.2.0 (Server-first architecture)
- **Node.js:** 20.9.0+ (Required minimum)
- **Routing Model:** File-system driven, async `params`, streaming by default

---

## Table of Contents

1. [App Router Fundamentals](#app-router-fundamentals)
2. [File Conventions](#file-conventions)
3. [Routing Patterns](#routing-patterns)
4. [Layout Patterns](#layout-patterns)
5. [Loading, Error & Not Found States](#loading-error--not-found-states)
6. [Metadata Patterns](#metadata-patterns)
7. [Server Actions & Forms](#server-actions--forms)
8. [Data Fetching & Streaming](#data-fetching--streaming)
9. [Caching & Revalidation](#caching--revalidation)
10. [Next.js 16 Breaking Changes](#nextjs-breaking-changes)
11. [Detection Commands](#detection-commands)
12. [Complete Examples](#complete-examples)

---

## App Router Fundamentals

- **Async boundaries everywhere.** Route segments, layouts, and pages can be async. `params` and `searchParams` are **promises**—you must `await` them before destructuring.
- **Server Components by default.** The App Router renders React Server Components (RSC) and only hydrates islands that opt into `'use client'`.
- **Streaming-first.** Every page segment renders inside `Suspense`. Provide fallbacks (`loading.tsx`, `<Suspense fallback={...}>`) to avoid waterfalls.
- **Colocation-friendly.** Co-locate layouts, error boundaries, and metadata with routes without increasing bundle size.
- **Turbopack default.** 2-5× faster production builds, up to 10× faster Fast Refresh.

---

## File Conventions

| File | Purpose | Notes |
| --- | --- | --- |
| `layout.tsx` | Persistent shell for a segment | Can be async; params/searchParams are promises. |
| `page.tsx` | Route entry point | Keep to imports + JSX; delegate logic to features. |
| `loading.tsx` | Suspense fallback | Server component; render skeletons. |
| `error.tsx` | Error boundary UI | Must be `'use client'`; use `useEffect` for logging. |
| `not-found.tsx` | 404 for a segment | Server component; used by `notFound()`. |
| `default.tsx` | Parallel route fallback | **REQUIRED** in Next.js 16 for all parallel slots. Return `null` or placeholder. |
| `route.ts` | API/Route handler | Export HTTP methods (`GET`, `POST`, etc.). |
| `generateMetadata.ts` (optional) | Segment metadata | Accepts `{ params, searchParams }` (promises). Return `Metadata`. |
| `template.tsx` | Re-render on navigation | Useful for entry animations; not cached between routes. |

**Rule:** Only create the files you need. Missing files fall back to parents (e.g., no `loading.tsx` uses ancestor fallback).

**⚠️ Next.js 16:** All parallel route slots (@slot) MUST have a `default.tsx` file or build will fail.

---

## Routing Patterns

### Static & Dynamic Segments

- **Static:** `app/(marketing)/about/page.tsx` → `/about`
- **Dynamic:** `app/(business)/appointments/[businessId]/page.tsx`
- **Optional Catch-all:** `app/docs/[[...slug]]/page.tsx` handles `/docs`, `/docs/a`, etc.
- **Parallel Slots:**
  ```
  app/
  ├── layout.tsx
  ├── page.tsx
  ├── @analytics/
  │   ├── default.tsx      ← REQUIRED in Next.js 16
  │   └── page.tsx
  └── @notifications/
      ├── default.tsx      ← REQUIRED in Next.js 16
      └── page.tsx
  ```
  Layout signature must accept each slot: `({ children, analytics, notifications })`.

### Route Groups & Shared Layouts

Wrap segments in parentheses to organize without affecting URLs:

```
app/
├── (marketing)/
│   ├── layout.tsx
│   └── page.tsx
└── (app)/
    ├── layout.tsx
    └── dashboard/page.tsx
```

### Intercepted Routes (modals)

```
app/
├── photos/[id]/page.tsx
├── @modal/
│   ├── default.tsx        ← REQUIRED in Next.js 16
│   └── (.)photos/[id]/page.tsx
```

- `(.)` intercepts sibling segments.
- `(..)` intercepts one level up; `(...)` from root.
- Use `<Suspense>` inside modals for streaming content.

---

## Layout Patterns

### Root Layout

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ENORAE Platform',
    template: '%s · ENORAE',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
```

### Segment Layout with Params (Next.js 16)

```tsx
// app/(business)/[businessId]/layout.tsx
export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ businessId: string }>
}) {
  // ✅ Next.js 16: Must await params
  const { businessId } = await params

  return (
    <section data-business={businessId}>{children}</section>
  )
}
```

### Templates for Re-rendered Segments

```tsx
// app/(app)/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>
}
```

---

## Loading, Error & Not Found States

```tsx
// loading.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
```

```tsx
// error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="grid min-h-[60vh] place-content-center gap-4 text-center">
      <div>
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground">Try again or return home.</p>
      </div>
      <Button onClick={() => reset()}>Retry</Button>
    </div>
  )
}
```

```tsx
// not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-content-center gap-4 text-center">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-muted-foreground">Check the URL or return home.</p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
```

```tsx
// default.tsx (for parallel routes)
export default function Default() {
  return null
}

// Or with notFound()
import { notFound } from 'next/navigation'

export default function Default() {
  notFound()
}
```

---

## Metadata Patterns

- Prefer the `metadata` export for static values; use `generateMetadata` for dynamic data.
- The function receives `{ params, searchParams }` as promises.

```ts
import type { Metadata } from 'next'
import { getBusinessName } from '@/features/business/metadata'

export async function generateMetadata({
  params
}: {
  params: Promise<{ businessId: string }>
}): Promise<Metadata> {
  // ✅ Next.js 16: Must await params
  const { businessId } = await params
  const name = await getBusinessName(businessId)

  return {
    title: name ? `${name} · Appointments` : 'Appointments',
    openGraph: {
      title: `${name ?? 'Business'} · Appointments`,
      type: 'website',
    },
  }
}
```

Common metadata keys: `title`, `description`, `openGraph`, `twitter`, `alternates`, `robots`, `viewport`.

---

## Server Actions & Forms

- Server Actions live alongside features or inside `app/(segment)/actions.ts`.
- Use `<form action={action}>` or `formAction` on buttons; React handles POST requests automatically.
- Combine with React 19 hooks (`useActionState`, `useOptimistic`) for form UX.

```tsx
'use client'

import { useActionState } from 'react'
import { updateName } from '@/features/profile/api/mutations'

export function NameForm({ initialName }: { initialName: string }) {
  const [state, action, pending] = useActionState(updateName, { message: '', value: initialName })

  return (
    <form action={action} className="space-y-4">
      <input name="name" defaultValue={state.value} className="input" />
      {state.message && <p className="text-destructive text-sm">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn">
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
```

Server Action example (Next.js 16):

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { profileNameSchema } from '@/features/profile/schema'
import { revalidatePath, updateTag } from 'next/cache'

export async function updateName(_: { message: string; value: string }, formData: FormData) {
  const name = formData.get('name')

  // ✅ Next.js 16: Must await createClient()
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { message: 'Unauthorized', value: '' }

  const payload = profileNameSchema.safeParse({ name })
  if (!payload.success) {
    return { message: payload.error.issues[0]?.message ?? 'Invalid name', value: String(name ?? '') }
  }

  const { error } = await supabase
    .schema('identity')
    .from('profiles')
    .update({ full_name: payload.data.name })
    .eq('id', user.id)

  if (error) {
    return { message: error.message, value: payload.data.name }
  }

  // ✅ Next.js 16: Use updateTag for immediate refresh
  updateTag(`profile:${user.id}`)

  // ✅ Next.js 16: revalidatePath requires type parameter
  revalidatePath('/settings/profile', 'page')

  return { message: '', value: payload.data.name }
}
```

---

## Data Fetching & Streaming

### Fetch Behaviours

| Pattern | Description |
| --- | --- |
| `fetch(url)` | Cached until route invalidation (`force-cache`). |
| `fetch(url, { cache: 'no-store' })` | Always dynamic (SSR each request). |
| `fetch(url, { next: { revalidate: 300 } })` | Static with background regeneration every 5 minutes. |
| `fetch(url, { next: { tags: ['customers'] } })` | Cache keyed by tag; revalidate via `revalidateTag('customers', 'max')`. |

### Parallel Fetching (Next.js 16)

```ts
// ✅ Next.js 16: Must await createClient()
const supabase = await createClient()

const [profile, appointments] = await Promise.all([
  supabase.from('profiles_view').select('*').single(),
  supabase.from('appointments_view').select('*').limit(20),
])
```

### Streaming UI

```tsx
import { Suspense } from 'react'
import { SlowAnalytics } from './components/slow-analytics'

export default function Dashboard() {
  return (
    <div className="grid gap-6">
      <section>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </section>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading analytics…</div>}>
        <SlowAnalytics />
      </Suspense>
    </div>
  )
}
```

---

## Caching & Revalidation

### Cache Invalidation APIs (Next.js 16)

- **`updateTag('tag')`** – Immediately expires tagged cache, read-your-writes semantics (Server Actions only)
- **`revalidateTag('tag', 'max')`** – Stale-while-revalidate for all fetches tagged with `tag` (requires cache profile)
- **`revalidatePath('/route', 'page')`** – Regenerates route on next request (requires type: 'page' | 'layout')
- **`refresh()`** – Server Action helper to refresh the current client-side router cache
- **`cacheTag('tag')`** – Attach a tag inside `'use cache'` functions for later invalidation

> ⚠️ **Next.js 16 Breaking Changes:**
> - `revalidateTag()` now requires a second parameter: cache profile (`'max'`, `'hours'`, `'days'`, or custom)
> - `revalidatePath()` now requires a second parameter: type (`'page'` or `'layout'`)
> - `updateTag()` is new in Next.js 16 and only works in Server Actions

### Cache Profile Options

```ts
// Built-in profiles
'max'   // Recommended for most cases - maximum SWR tolerance
'hours' // Revalidate after hours
'days'  // Revalidate after days

// Custom profile from next.config.ts
'salons'    // If defined in config
'analytics' // If defined in config

// Inline object
{ revalidate: 3600 } // 1 hour in seconds
```

### Configure Custom Cache Profiles

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheLife: {
    default: {
      stale: 300,      // 5 minutes
      revalidate: 900, // 15 minutes
      expire: 3600,    // 1 hour
    },
    salons: {
      stale: 900,       // 15 minutes
      revalidate: 3600, // 1 hour
      expire: 86400,    // 24 hours
    },
    analytics: {
      stale: 3600,      // 1 hour
      revalidate: 7200, // 2 hours
      expire: 86400,    // 24 hours
    },
  },
}

export default nextConfig
```

### Tag Naming Conventions

```ts
// ✅ GOOD - Descriptive, hierarchical tags
'appointments'                    // All appointments
`appointments:${businessId}`      // Business-specific appointments
`appointment:${appointmentId}`    // Single appointment
'user-profile'                    // All user profiles
`user-profile:${userId}`          // Specific user profile

// ❌ BAD - Vague or overly generic tags
'data'                            // Too generic
'cache'                           // Not descriptive
'stuff'                           // Meaningless
```

### updateTag vs revalidateTag (Next.js 16)

```ts
// ✅ updateTag - Immediate consistency (read-your-writes)
'use server'
export async function createAppointment(data: AppointmentInput) {
  const supabase = await createClient()

  const { data: appointment } = await supabase
    .from('appointments')
    .insert(data)
    .select()
    .single()

  // User must see their new appointment immediately
  updateTag('appointments')
  updateTag(`appointments:${data.businessId}`)
  updateTag(`appointment:${appointment.id}`)

  redirect(`/appointments/${appointment.id}`)
}

// ✅ revalidateTag - Eventual consistency (background refresh)
'use server'
export async function incrementViewCount(appointmentId: string) {
  const supabase = await createClient()

  await supabase
    .from('appointments')
    .update({ view_count: sql`view_count + 1` })
    .eq('id', appointmentId)

  // View count can update in background (not critical)
  // ✅ Next.js 16: Requires cache profile
  revalidateTag(`appointment:${appointmentId}`, 'max')
}
```

### cacheTag + 'use cache' (Next.js 16)

```ts
import { cacheTag } from 'next/cache'

export async function getDashboard() {
  'use cache' // Required to opt in to function-level caching
  cacheTag('dashboard')
  return fetchDashboardFromDb()
}
```

### Complete Cache Strategy Example (Next.js 16)

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { updateTag, revalidateTag, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { appointmentSchema } from '../schema'

export async function createAppointment(input: unknown) {
  // ✅ Next.js 16: Must await createClient()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const payload = appointmentSchema.parse(input)

  const { data, error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .insert({ ...payload, business_id: user.id })
    .select()
    .single()

  if (error) throw error

  // 1. Update specific resource cache (immediate)
  updateTag(`appointment:${data.id}`)

  // 2. Update collection caches (immediate)
  updateTag('appointments')
  updateTag(`appointments:${user.id}`)
  updateTag(`business:${user.id}:dashboard`)

  // 3. Update related caches (background)
  // ✅ Next.js 16: Requires cache profile
  revalidateTag(`staff:${data.staff_id}:schedule`, 'max')
  revalidateTag(`customer:${data.customer_id}:bookings`, 'max')

  // 4. Optional: Invalidate entire route (use sparingly)
  // ✅ Next.js 16: Requires type parameter
  // revalidatePath('/business/appointments', 'layout')

  redirect(`/business/appointments/${data.id}`)
}

export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('scheduling')
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .eq('business_id', user.id)

  if (error) throw error

  // Only update necessary tags
  updateTag(`appointment:${id}`)
  updateTag(`appointments:${user.id}`)

  // No redirect needed for status updates
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

  // Clear all appointment caches
  updateTag(`appointment:${id}`)
  updateTag('appointments')
  updateTag(`appointments:${user.id}`)

  // Redirect after delete
  // ✅ Next.js 16: Requires type parameter
  revalidatePath('/business/appointments', 'layout')
  redirect('/business/appointments')
}
```

### refresh() API (Next.js 16)

```ts
'use server'

import { refresh } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient()

  // Update database
  await supabase
    .schema('communication')
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  // Refresh uncached notification count in header
  // Cached page shells remain fast
  refresh()
}
```

### Segment Configuration

```ts
// app/dashboard/page.tsx
export const dynamic = 'force-static'      // Force static generation
export const revalidate = 3600             // Revalidate every hour
export const fetchCache = 'default-cache'  // Use default cache behavior

// app/api/live-data/route.ts
export const dynamic = 'force-dynamic'     // Always run on server
export const revalidate = 0                // Never cache
```

### Best Practices

1. **Prefer tags over paths** – More granular control
2. **Use updateTag for writes** – Immediate consistency, read-your-writes
3. **Use revalidateTag for background** – Eventual consistency, SWR
4. **Always include cache profile** – `revalidateTag(tag, 'max')` required in Next.js 16
5. **Always include type parameter** – `revalidatePath(path, 'page')` required in Next.js 16
6. **Namespace tags hierarchically** – `resource`, `resource:id`, `resource:id:detail`
7. **Document tag usage** – Comment which mutations affect which tags
8. **Test cache invalidation** – Verify data refreshes correctly
9. **Monitor cache hit rates** – Ensure caching is working

Choose the narrowest invalidation surface area possible. Tags beat paths; request-level revalidate beats route-level when only a single fetch changes.

---

## Next.js 16 Breaking Changes

### 1. Async params and searchParams

**Old (Next.js 15):**
```tsx
export default function Page({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>
}
```

**New (Next.js 16):**
```tsx
export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <div>{id}</div>
}
```

### 2. Async cookies() and headers()

**Old (Next.js 15):**
```ts
import { cookies } from 'next/headers'

export function getSession() {
  const sessionCookie = cookies().get('session')
  return sessionCookie?.value
}
```

**New (Next.js 16):**
```ts
import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  return sessionCookie?.value
}
```

### 3. Supabase createClient() must be async

**Old (Next.js 15):**
```ts
export function createClient() {
  const cookieStore = cookies()  // Sync
  return createServerClient(...)
}

// Usage
const supabase = createClient()
```

**New (Next.js 16):**
```ts
export async function createClient() {
  const cookieStore = await cookies()  // Async
  return createServerClient(...)
}

// Usage - must await!
const supabase = await createClient()
```

### 4. revalidateTag() requires cache profile

**Old (Next.js 15):**
```ts
revalidateTag('appointments')
```

**New (Next.js 16):**
```ts
revalidateTag('appointments', 'max')  // Requires 2nd parameter
```

### 5. revalidatePath() requires type parameter

**Old (Next.js 15):**
```ts
revalidatePath('/dashboard')
```

**New (Next.js 16):**
```ts
revalidatePath('/dashboard', 'layout')  // or 'page'
```

### 6. Parallel routes require default.tsx

**Old (Next.js 15):**
```
app/
  @modal/
    login/page.tsx
```

**New (Next.js 16):**
```
app/
  @modal/
    default.tsx       ← REQUIRED or build fails
    login/page.tsx
```

### 7. middleware.ts → proxy.ts (deprecated)

**Old (Next.js 15):**
```ts
// middleware.ts
export function middleware(request: NextRequest) {
  return NextResponse.redirect(...)
}

export const config = {
  matcher: '/api/:path*'
}
```

**New (Next.js 16):**
```ts
// proxy.ts
export default function proxy(request: NextRequest) {
  return NextResponse.redirect(...)
}

export const config = {
  matcher: ['/api/:path*']  // Must be array
}
```

### Migration Checklist

- [ ] All page/layout functions with params are async and await params
- [ ] All searchParams access uses await
- [ ] All cookies() calls are awaited
- [ ] All headers() calls are awaited
- [ ] All draftMode() calls are awaited
- [ ] All createClient() calls are awaited
- [ ] All revalidateTag() calls include cache profile
- [ ] All revalidatePath() calls include type parameter
- [ ] All parallel route slots have default.tsx files
- [ ] middleware.ts renamed to proxy.ts (if applicable)

**Detection:** See [Detection Commands](#detection-commands) section below.

---

## Detection Commands

```bash
# Find page/layout files accessing params without awaiting
rg "params\." app --type tsx -B 2 | grep -v "await params"

# Find searchParams access without await
rg "searchParams\." app --type tsx -B 2 | grep -v "await searchParams"

# Find cookies() without await
rg "cookies\(\)" --type ts -B 1 | grep -v "await"

# Find headers() without await
rg "headers\(\)" --type ts -B 1 | grep -v "await"

# Find createClient() without await
rg "createClient\(\)" --type ts -B 2 | grep -v "await createClient"

# Find revalidateTag without cache profile
rg "revalidateTag\(['\"][\w-]+['\"]\)(?!\s*,)" --type ts

# Find revalidatePath without type parameter
rg "revalidatePath\(['\"][^'\"]+['\"]\)(?!\s*,)" --type ts

# Find parallel routes missing default.tsx
find app -type d -name "@*" -exec sh -c '[ ! -f "$1/default.tsx" ] && echo "Missing: $1/default.tsx"' _ {} \;

# Ensure Server Actions declare 'use server'
rg --files -g 'actions.ts' app features | xargs -I{} sh -c "grep -L \"'use server'\" {}"

# Identify client components missing 'use client' while using hooks
rg "(useState|useEffect|useActionState|useOptimistic|useTransition)" app --type tsx \
  | xargs -I{} sh -c "grep -L \"'use client'\" {}"

# Detect route handlers longer than 120 lines
find app/api -name 'route.ts' -exec sh -c 'wc -l "$1" | awk "{if (\$1 > 120) print \$0}"' _ {} \;

# Catch legacy Pages Router functions
rg "getServerSideProps|getStaticProps|getInitialProps" --type ts --type tsx app
```

---

## Complete Examples

### Dynamic Page with Async Params (Next.js 16)

```tsx
// app/(business)/appointments/[appointmentId]/page.tsx
import { Suspense } from 'react'
import { AppointmentDetail } from '@/features/business/appointments'
import { Skeleton } from '@/components/ui/skeleton'

export default async function Page({
  params
}: {
  params: Promise<{ appointmentId: string }>
}) {
  // ✅ Next.js 16: Must await params
  const { appointmentId } = await params

  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <AppointmentDetail appointmentId={appointmentId} />
    </Suspense>
  )
}
```

### Parallel Route with Modal Intercept (Next.js 16)

```
app/
├── layout.tsx
├── page.tsx
├── @modal/
│   ├── default.tsx           ← REQUIRED in Next.js 16
│   └── (.)photos/
│       └── [id]/page.tsx
└── photos/
    └── [id]/page.tsx
```

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null
}
```

```tsx
// app/@modal/(.)photos/[id]/page.tsx
import { Suspense } from 'react'
import { PhotoModal } from '@/features/gallery/photo-modal'

export default async function Modal({
  params
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={null}>
      <PhotoModal params={params} />
    </Suspense>
  )
}
```

### Server Action Form (Next.js 16)

```tsx
// app/(account)/settings/profile/page.tsx
import { Suspense } from 'react'
import { NameForm } from '@/features/profile/components/name-form'
import { createClient } from '@/lib/supabase/server'

export default async function ProfileSettings() {
  // ✅ Next.js 16: Must await createClient()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles_view')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <Suspense fallback={<div>Loading…</div>}>
      <NameForm initialName={profile?.full_name ?? ''} />
    </Suspense>
  )
}
```

### Search Page with searchParams (Next.js 16)

```tsx
// app/search/page.tsx
import { Suspense } from 'react'
import { SearchResults } from '@/features/search'

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  // ✅ Next.js 16: Must await searchParams
  const { q, page } = await searchParams

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      <Suspense fallback={<div>Searching...</div>}>
        <SearchResults query={q ?? ''} page={parseInt(page ?? '1')} />
      </Suspense>
    </div>
  )
}
```

---

**Last Updated:** 2025-10-26 (Next.js 16 patterns with breaking changes)
**Next.js Version:** 16.0.0
**React Version:** 19.2.0

**Related Documentation:**
- [Next.js 16 Rules](../nextjs16.md)
- [Supabase Patterns](./supabase-patterns.md)
- [Architecture Patterns](./architecture-patterns.md)
