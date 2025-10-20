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

- **`revalidatePath('/route')`** – Regenerates the entire route subtree on next request.
- **`revalidateTag('tag', 'max')`** – Stale-while-revalidate for all fetches tagged with `tag`.
- **`updateTag('tag')`** – Immediately expires tagged cache (read-after-write).
- **`refresh()`** – Server Action helper to refresh the current client-side router cache.
- **Segment config:**
  ```ts
  export const dynamic = 'force-static' | 'force-dynamic'
  export const revalidate = 0 | false | number
  export const fetchCache = 'default-cache' | 'only-no-store'
  ```

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

**Last Updated:** 2025-10-19
