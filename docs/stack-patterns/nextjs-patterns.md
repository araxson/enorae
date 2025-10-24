# Next.js Patterns

**Standalone reference for Next.js 15 App Router patterns. No external dependencies.**

---

## Stack Context

- **Next.js:** 15.5.4 (App Router)
- **React:** 19.1.0 (Server-first architecture)
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
10. [Detection Commands](#detection-commands)
11. [Complete Examples](#complete-examples)

---

## App Router Fundamentals

- **Async boundaries everywhere.** Route segments, layouts, and pages can be async. `params` and `searchParams` are **promises**—you must `await` or `use()` them before destructuring.
- **Server Components by default.** The App Router renders React Server Components (RSC) and only hydrates islands that opt into `'use client'`.
- **Streaming-first.** Every page segment renders inside `Suspense`. Provide fallbacks (`loading.tsx`, `<Suspense fallback={...}>`) to avoid waterfalls.
- **Colocation-friendly.** Co-locate layouts, error boundaries, and metadata with routes without increasing bundle size.

---

## File Conventions

| File | Purpose | Notes |
| --- | --- | --- |
| `layout.tsx` | Persistent shell for a segment | Can be async; use `use(params)` to unwrap promises inside synchronous layouts. |
| `page.tsx` | Route entry point | Keep to imports + JSX; delegate logic to features. |
| `loading.tsx` | Suspense fallback | Server component; render skeletons. |
| `error.tsx` | Error boundary UI | Must be `'use client'`; use `useEffect` for logging. |
| `not-found.tsx` | 404 for a segment | Server component; used by `notFound()`. |
| `default.tsx` | Parallel route fallback | Return `null` or placeholder while slot is inactive. |
| `route.ts` | API/Route handler | Export HTTP methods (`GET`, `POST`, etc.). |
| `generateMetadata.ts` (optional) | Segment metadata | Accepts `{ params, searchParams }` (promises). Return `Metadata`. |
| `template.tsx` | Re-render on navigation | Useful for entry animations; not cached between routes. |

**Rule:** Only create the files you need. Missing files fall back to parents (e.g., no `loading.tsx` uses ancestor fallback).

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
  ├── @analytics/page.tsx
  └── @notifications/page.tsx
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
└── @modal/(.)photos/[id]/page.tsx
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

### Segment Layout with Params

```tsx
// app/(business)/[businessId]/layout.tsx
import { use } from 'react'

export default function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = use(params)

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

---

## Metadata Patterns

- Prefer the `metadata` export for static values; use `generateMetadata` for dynamic data.
- The function receives `{ params, searchParams }` as promises.

```ts
import type { Metadata } from 'next'
import { getBusinessName } from '@/features/business/metadata'

export async function generateMetadata({ params }: { params: Promise<{ businessId: string }> }): Promise<Metadata> {
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

Server Action example:

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { profileNameSchema } from '@/features/profile/schema'
import { revalidatePath, updateTag } from 'next/cache'

export async function updateName(_: { message: string; value: string }, formData: FormData) {
  const name = formData.get('name')
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

  updateTag(`profile:${user.id}`)
  revalidatePath('/settings/profile')
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
| `fetch(url, { next: { tags: ['customers'] } })` | Cache keyed by tag; revalidate via `revalidateTag('customers')`. |

### Parallel Fetching

```ts
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

### Cache Invalidation APIs

- **`updateTag('tag')`** – Immediately expires tagged cache (Server Actions only)
- **`revalidateTag('tag')`** – Stale-while-revalidate for all fetches tagged with `tag`
- **`revalidateTag('tag', 'max')`** – Maximum staleness tolerance
- **`revalidatePath('/route')`** – Regenerates the entire route subtree on next request
- **`refresh()`** – Server Action helper to refresh the current client-side router cache
- **`cacheTag('tag')`** – Attach a tag inside `'use cache'` functions for later invalidation

> ⚠️ `updateTag` throws in Route Handlers—use `revalidateTag(tag, 'max')` there. It is only valid inside Server Actions per Next.js 15 docs.

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

### updateTag vs revalidateTag

```ts
// ✅ updateTag - Immediate consistency (read-your-writes)
'use server'
export async function createAppointment(data: AppointmentInput) {
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
export async function incrementViewCount(appointmentId: string) {
  await supabase
    .from('appointments')
    .update({ view_count: sql`view_count + 1` })
    .eq('id', appointmentId)

  // View count can update in background (not critical)
  revalidateTag(`appointment:${appointmentId}`)
  // Note: No redirect needed, just fire-and-forget
}
```

### cacheTag + 'use cache'

```ts
import { cacheTag } from 'next/cache'

export async function getDashboard() {
  'use cache' // Required to opt in to function-level caching
  cacheTag('dashboard')
  return fetchDashboardFromDb()
}
```

### Client Router Cache (staleTimes)

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30, // seconds
      static: 180,
    },
  },
}

module.exports = nextConfig
```

### Complete Cache Strategy Example

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { updateTag, revalidateTag, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { appointmentSchema } from '../schema'

export async function createAppointment(input: unknown) {
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
  revalidateTag(`staff:${data.staff_id}:schedule`)
  revalidateTag(`customer:${data.customer_id}:bookings`)

  // 4. Optional: Invalidate entire route (use sparingly)
  // revalidatePath('/business/appointments')

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
  revalidatePath('/business/appointments')
  redirect('/business/appointments')
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
2. **Use updateTag for writes** – Immediate consistency
3. **Use revalidateTag for background** – Eventual consistency
4. **Namespace tags hierarchically** – `resource`, `resource:id`, `resource:id:detail`
5. **Document tag usage** – Comment which mutations affect which tags
6. **Test cache invalidation** – Verify data refreshes correctly
7. **Monitor cache hit rates** – Ensure caching is working

Choose the narrowest invalidation surface area possible. Tags beat paths; request-level revalidate beats route-level when only a single fetch changes.

---

## Detection Commands

```bash
# Find page/layout files accessing params without awaiting the promise
rg "params\." app --type tsx \
  | grep -v "await params" \
  | grep -v "use(params)"

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

### Parallel Route with Modal Intercept

```
app/
├── layout.tsx
├── page.tsx
├── @modal/
│   └── (.)photos/
│       └── [id]/page.tsx
└── photos/
    └── [id]/page.tsx
```

```tsx
// app/@modal/(.)photos/[id]/page.tsx
import { Suspense } from 'react'
import { PhotoModal } from '@/features/gallery/photo-modal'

export default async function Modal(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <PhotoModal {...props} />
    </Suspense>
  )
}
```

### Server Action Form

```tsx
// app/(account)/settings/profile/page.tsx
import { Suspense } from 'react'
import { NameForm } from '@/features/profile/components/name-form'

export default function ProfileSettings() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <NameForm initialName="" />
    </Suspense>
  )
}
```

---

**Last Updated:** 2025-10-21 (Enhanced caching patterns with updateTag/revalidateTag examples)
