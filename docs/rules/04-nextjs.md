# Next.js 15/16 Patterns

**Purpose:** Framework-specific patterns for Next.js App Router with async params, caching strategies, and Server Actions

**Last Updated:** 2025-11-03
**Stack Version:** Next.js 15.5.0, React 19.0.0, Node.js 20.9.0+

**Recent Updates:**
- **Next.js 15.5.0** (November 2025) - Latest stable version with React 19 support
- **Stable Node.js Middleware** (15.2+) - Middleware now supports both Edge and Node.js runtimes
- **OpenTelemetry Built-in** - Native instrumentation support with @vercel/otel
- **Dynamic IO API** (`use cache` directive) - Incremental caching model for functions and components
- **PPR Still Experimental** - Partial Prerendering NOT production-ready (use `experimental_ppr`)
- **Breaking: Fetch no longer cached by default** - Must use `cache: 'force-cache'` explicitly
- **Breaking: Route Handler GET not cached** - Must set `dynamic = 'force-static'`
- **Breaking: `default.tsx` REQUIRED** for parallel routes (build fails without it)
- `updateTag()` API for read-your-writes consistency (Server Actions only)
- `refresh()` API for client router refresh from Server Actions
- `cacheLife` profiles now stable (no longer `unstable_cacheLife`)
- Turbopack file system caching available (`experimental.turbopackFileSystemCacheForDev`)

---

## Quick Decision Tree

```
Fetching data?
├─ On page/layout → Use async Server Component with fetch/Supabase
├─ On mutation → Use Server Action with revalidation
└─ On API endpoint → Use Route Handler (GET/POST/etc.)

Caching strategy?
├─ User writes data → Use updateTag() for immediate consistency (Server Actions only)
├─ Background refresh → Use revalidateTag(tag, 'max')
├─ Client router refresh → Use refresh() in Server Action
├─ Entire route → Use revalidatePath(path, 'page' | 'layout')
└─ Never cache → Use { cache: 'no-store' }

Accessing params?
├─ In page/layout → Must await params promise
├─ In generateMetadata → Must await params promise
├─ In Route Handler → Must await params from segmentData
└─ In Client Component → Use React.use(params)

Need to invalidate cache?
├─ After mutation (immediate) → updateTag('resource') [Server Actions only]
├─ After mutation (background) → revalidateTag('resource', 'max')
├─ Client router refresh → refresh() [Server Actions only]
├─ Entire page → revalidatePath('/path', 'page')
└─ All routes → revalidatePath('/', 'layout')
```

---

## Critical Rules

### ✅ MUST Follow
1. **Await all params/searchParams** - Next.js 15+ requires Promise handling
2. **Await createClient()** - Supabase client creation is now async
3. **Include cache profile in revalidateTag()** - Second parameter required: `revalidateTag(tag, 'max')`
4. **Include type in revalidatePath()** - Second parameter required: `revalidatePath(path, 'page')`
5. **Use updateTag() in Server Actions** - For immediate read-your-writes consistency (Server Actions only)
6. **Use refresh() for client updates** - To refresh router cache after mutations (Server Actions only)
7. **Create default.tsx for parallel routes** - Build will FAIL without it in Next.js 15+
8. **Explicitly cache fetch requests** - Default changed to no-cache in Next.js 15
9. **Use 'use server' in Server Actions** - Explicit directive required
10. **Use 'use client' for hooks** - Client Components must declare directive
11. **Namespace cache tags hierarchically** - `resource`, `resource:id`, `resource:id:detail`
12. **Keep pages under 200 lines** - Delegate logic to features/

### ❌ FORBIDDEN
1. **Pages Router patterns** - No getServerSideProps, getStaticProps, getInitialProps
2. **Synchronous params access** - Must await in Next.js 15+
3. **Synchronous cookies()/headers()** - Must await in Next.js 15+
4. **revalidateTag() without cache profile** - `revalidateTag('tag')` will error (Next.js 15+)
5. **revalidatePath() without type** - `revalidatePath('/path')` will error (Next.js 15+)
6. **Parallel routes without default.tsx** - Build will fail (Next.js 15+)
7. **Generic cache tag names** - No 'data', 'cache', 'stuff'
8. **Client Components with async** - Use React.use() instead
9. **Assuming fetch is cached** - Must explicitly set `cache: 'force-cache'` (Next.js 15+)
10. **Using updateTag() outside Server Actions** - Only works in Server Actions
11. **Using refresh() outside Server Actions** - Only works in Server Actions
12. **Runtime config** - serverRuntimeConfig/publicRuntimeConfig removed (Next.js 15+)
13. **Using PPR in production** - Still experimental, not production-ready
14. **Sequential data fetching** - Use Promise.all() for parallel queries
15. **Missing CSP headers** - Production apps must implement Content Security Policy
16. **No rate limiting** - Public API routes must have abuse prevention
17. **Missing OpenTelemetry** - Production apps need instrumentation
18. **'use cache' without cacheTag()** - Cannot invalidate granularly
19. **Edge runtime for heavy operations** - Use Node.js runtime for DB/file operations
20. **Single Suspense for entire page** - Use granular boundaries for streaming

---

## Patterns

### Pattern 1: Async Page with Params (Next.js 16)
**When to use:** Every page with dynamic route segments
**Implementation:**
```tsx
// ✅ CORRECT - Async page with await params
// app/(business)/salons/[salonId]/page.tsx
import { Suspense } from 'react'
import { SalonDetail } from '@/features/business/salons'
import { Skeleton } from '@/components/ui/skeleton'

export default async function Page({
  params
}: {
  params: Promise<{ salonId: string }>
}) {
  // ✅ Next.js 15+: Must await params
  const { salonId } = await params

  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <SalonDetail salonId={salonId} />
    </Suspense>
  )
}

// ❌ WRONG - Synchronous params access
export default function Page({
  params
}: {
  params: { salonId: string }
}) {
  // ❌ Error: params is a Promise in Next.js 16
  const { salonId } = params
  return <SalonDetail salonId={salonId} />
}
```

### Pattern 2: Search Page with searchParams (Next.js 16)
**When to use:** Pages with query parameters (search, filters, pagination)
**Implementation:**
```tsx
// ✅ CORRECT - Async searchParams handling
// app/search/page.tsx
import { Suspense } from 'react'
import { SearchResults } from '@/features/customer/salon-search'

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string; location?: string }>
}) {
  // ✅ Next.js 15+: Must await searchParams
  const { q, page, location } = await searchParams

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      <Suspense fallback={<div>Searching...</div>}>
        <SearchResults
          query={q ?? ''}
          page={parseInt(page ?? '1')}
          location={location}
        />
      </Suspense>
    </div>
  )
}

// ❌ WRONG - Synchronous searchParams
export default function SearchPage({
  searchParams
}: {
  searchParams: { q?: string }
}) {
  // ❌ Error: searchParams is a Promise in Next.js 16
  const { q } = searchParams
  return <SearchResults query={q ?? ''} />
}
```

### Pattern 3: Dynamic Metadata (Next.js 16)
**When to use:** SEO optimization for dynamic pages
**Implementation:**
```tsx
// ✅ CORRECT - Async generateMetadata
// app/(business)/salons/[salonId]/page.tsx
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({
  params
}: {
  params: Promise<{ salonId: string }>
}): Promise<Metadata> {
  // ✅ Next.js 15+: Must await params
  const { salonId } = await params

  // ✅ Next.js 15+: Must await createClient()
  const supabase = await createClient()

  const { data: salon } = await supabase
    .from('salons_view')
    .select('name, description')
    .eq('id', salonId)
    .single()

  return {
    title: salon?.name ? `${salon.name} · ENORAE` : 'Salon · ENORAE',
    description: salon?.description ?? 'Book your appointment today',
    openGraph: {
      title: salon?.name ?? 'Salon',
      description: salon?.description ?? '',
      type: 'website',
    },
  }
}

// ❌ WRONG - Synchronous params in generateMetadata
export function generateMetadata({
  params
}: {
  params: { salonId: string }
}): Metadata {
  // ❌ Error: generateMetadata must be async and await params
  const { salonId } = params
  return { title: salonId }
}
```

### Pattern 4: Server Action with updateTag (Next.js 16)
**When to use:** Creating/updating data where user must see changes immediately
**Implementation:**
```tsx
// ✅ CORRECT - Server Action with updateTag
// features/business/appointments/api/mutations.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { updateTag, revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { appointmentSchema } from '../schema'

export async function createAppointment(input: unknown) {
  // ✅ Next.js 15+: Must await createClient()
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

  // ✅ Immediate consistency for user's write
  updateTag(`appointment:${data.id}`)
  updateTag('appointments')
  updateTag(`appointments:${user.id}`)

  // ✅ Next.js 15+: revalidatePath requires type parameter
  revalidatePath('/business/appointments', 'page')

  redirect(`/business/appointments/${data.id}`)
}

// ❌ WRONG - Using revalidateTag for writes
export async function createAppointment(input: unknown) {
  const supabase = await createClient() // Still wrong without 'use server'
  const { data } = await supabase.from('appointments').insert(input).select().single()

  // ❌ Error: Should use updateTag() for immediate consistency
  revalidateTag('appointments', 'max')

  // ❌ Error: Missing type parameter
  revalidatePath('/business/appointments')
}
```

### Pattern 5: Background Revalidation with revalidateTag (Next.js 16)
**When to use:** Non-critical updates that can refresh in background
**Implementation:**
```tsx
// ✅ CORRECT - revalidateTag for background refresh
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

export async function incrementViewCount(appointmentId: string) {
  // ✅ Next.js 15+: Must await createClient()
  const supabase = await createClient()

  await supabase
    .from('appointments')
    .update({ view_count: supabase.rpc('increment') })
    .eq('id', appointmentId)

  // ✅ Background refresh - not critical for UX
  // ✅ Next.js 15+: Requires cache profile
  revalidateTag(`appointment:${appointmentId}`, 'max')
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient()

  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)

  // ✅ Background refresh with custom profile
  revalidateTag(`notifications`, 'hours')
}

// ❌ WRONG - Missing cache profile
export async function incrementViewCount(appointmentId: string) {
  const supabase = await createClient()
  await supabase.from('appointments').update({ view_count: 1 }).eq('id', appointmentId)

  // ❌ Error: revalidateTag requires second parameter in Next.js 15+
  revalidateTag(`appointment:${appointmentId}`)
}
```

### Pattern 6: Client Router Refresh with refresh() (Next.js 15.1+)
**When to use:** After mutations when you need to refresh client-side router cache
**Implementation:**
```tsx
// ✅ CORRECT - refresh() for client router updates
'use server'

import { createClient } from '@/lib/supabase/server'
import { refresh } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  // ✅ Next.js 15.1+: Must await createClient()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', user.id)

  // ✅ Refresh client router - updates notification count in header
  // ✅ Server Actions only - not available in Route Handlers
  refresh()
}

export async function toggleFavorite(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: existing } = await supabase
    .from('favorites')
    .select()
    .eq('salon_id', salonId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
  } else {
    await supabase.from('favorites').insert({ salon_id: salonId, user_id: user.id })
  }

  // ✅ Refresh client router - updates favorite icon state
  refresh()
}

// ❌ WRONG - Using refresh() outside Server Action
export async function GET(request: NextRequest) {
  // ❌ Error: refresh() only works in Server Actions
  refresh()
  return NextResponse.json({ success: true })
}
```

### Pattern 7: Route Handler with Async Params (Next.js 15+)
**When to use:** API endpoints for external webhooks or non-form submissions
**Implementation:**
```tsx
// ✅ CORRECT - Route Handler with async params
// app/api/webhooks/[provider]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(
  request: NextRequest,
  segmentData: { params: Promise<{ provider: string }> }
) {
  // ✅ Next.js 15+: Must await params
  const { provider } = await segmentData.params

  const secret = request.headers.get('x-webhook-secret')
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Handle webhook based on provider
  if (provider === 'stripe') {
    // ✅ Next.js 15+: Requires cache profile
    revalidateTag('transactions', 'max')
  }

  return NextResponse.json({ received: true })
}

// ❌ WRONG - Synchronous params access
export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  // ❌ Error: params is a Promise in Next.js 16
  const { provider } = params
  return NextResponse.json({ provider })
}
```

### Pattern 8: Parallel Routes with default.tsx (Next.js 16)
**When to use:** Modal intercepts, parallel sections, conditional UI
**Implementation:**
```
// ✅ CORRECT - Parallel route structure
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
// ✅ CORRECT - default.tsx for parallel route
// app/@modal/default.tsx
export default function Default() {
  return null
}

// ✅ CORRECT - Modal intercept page
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

// ✅ CORRECT - Layout accepting parallel slots
// app/layout.tsx
export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {modal}
      </body>
    </html>
  )
}

// ❌ WRONG - Missing default.tsx
app/
├── @modal/
│   └── (.)photos/[id]/page.tsx  ← Build will FAIL without default.tsx
```

### Pattern 9: Fetch with Cache Tags
**When to use:** Caching external API data with granular invalidation
**Implementation:**
```tsx
// ✅ CORRECT - Tagged fetch for cache control
// features/analytics/api/queries.ts
export async function getAnalytics(businessId: string) {
  const res = await fetch(`https://api.analytics.com/stats/${businessId}`, {
    next: {
      tags: ['analytics', `analytics:${businessId}`],
      revalidate: 3600, // 1 hour
    },
  })

  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}

// Invalidate from Server Action
'use server'
export async function refreshAnalytics(businessId: string) {
  // ✅ Next.js 15+: Requires cache profile
  revalidateTag(`analytics:${businessId}`, 'max')
}

// ❌ WRONG - No cache tags AND not explicitly cached
export async function getAnalytics(businessId: string) {
  // ❌ Missing tags - cannot invalidate granularly
  // ❌ Not cached - fetch is no longer cached by default in Next.js 15+
  const res = await fetch(`https://api.analytics.com/stats/${businessId}`)
  return res.json()
}

// ✅ CORRECT - Explicitly cache fetch requests (Next.js 15+)
export async function getAnalytics(businessId: string) {
  // ✅ Next.js 15+ requires explicit cache: 'force-cache'
  const res = await fetch(`https://api.analytics.com/stats/${businessId}`, {
    cache: 'force-cache', // Required in Next.js 15+
    next: {
      tags: ['analytics', `analytics:${businessId}`],
      revalidate: 3600,
    },
  })
  return res.json()
}
```

### Pattern 10: Client Component with Async Props
**When to use:** Client Components that receive params/searchParams
**Implementation:**
```tsx
// ✅ CORRECT - Client Component using React.use()
'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'

export function SalonFilters({
  searchParams
}: {
  searchParams: Promise<{ location?: string; service?: string }>
}) {
  // ✅ Client Components cannot be async - use React.use()
  const { location, service } = use(searchParams)
  const router = useRouter()

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams()
    if (value) params.set(key, value)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div>
      <input
        value={location ?? ''}
        onChange={(e) => handleFilterChange('location', e.target.value)}
      />
      <input
        value={service ?? ''}
        onChange={(e) => handleFilterChange('service', e.target.value)}
      />
    </div>
  )
}

// ❌ WRONG - Async Client Component
'use client'

// ❌ Error: Client Components cannot be async
export async function SalonFilters({ searchParams }) {
  const { location } = await searchParams
  return <div>{location}</div>
}
```

### Pattern 11: Streaming with Suspense
**When to use:** Slow data fetching that shouldn't block page render
**Implementation:**
```tsx
// ✅ CORRECT - Streaming with Suspense boundaries
// app/(business)/dashboard/page.tsx
import { Suspense } from 'react'
import { QuickStats } from '@/features/business/dashboard/components/quick-stats'
import { RecentAppointments } from '@/features/business/dashboard/components/recent-appointments'
import { AnalyticsChart } from '@/features/business/dashboard/components/analytics-chart'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Fast data - renders immediately */}
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <QuickStats />
      </Suspense>

      <div className="grid grid-cols-2 gap-6">
        {/* Medium speed data */}
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <RecentAppointments />
        </Suspense>

        {/* Slow data - doesn't block other sections */}
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <AnalyticsChart />
        </Suspense>
      </div>
    </div>
  )
}

// ❌ WRONG - No Suspense boundaries
export default async function Dashboard() {
  // ❌ Sequential awaits - creates waterfall
  const stats = await getQuickStats()
  const appointments = await getRecentAppointments()
  const analytics = await getAnalytics() // Slow query blocks entire page

  return (
    <div>
      <QuickStats data={stats} />
      <RecentAppointments data={appointments} />
      <AnalyticsChart data={analytics} />
    </div>
  )
}
```

---

## Caching Strategies

### Decision Tree: Which Revalidation API?

```
Need to invalidate cache?
├─ In Server Action after user write → updateTag('resource')
│   └─ Examples: create appointment, update profile, delete review
│   └─ Provides read-your-writes consistency (immediate)
│
├─ In Server Action for client router refresh → refresh()
│   └─ Examples: mark notification read, toggle favorite, update count
│   └─ Refreshes client-side router cache without full reload
│
├─ In Server Action for background refresh → revalidateTag('resource', 'max')
│   └─ Examples: increment view count, analytics updates
│   └─ Stale-while-revalidate pattern (eventual consistency)
│
├─ In Route Handler (webhooks) → revalidateTag('resource', 'max')
│   └─ Examples: Stripe webhook, CMS content update
│   └─ Cannot use updateTag() or refresh() in Route Handlers
│
├─ Entire page after mutation → revalidatePath('/path', 'page')
│   └─ Examples: redirect after delete, force full page refresh
│
└─ All routes (rare) → revalidatePath('/', 'layout')
    └─ Examples: site-wide settings change, global maintenance
```

### Cache Profile Options (Next.js 15+)

```ts
// Built-in profiles
'max'   // Maximum SWR tolerance - recommended for most cases
'hours' // Revalidate after hours
'days'  // Revalidate after days

// Custom profile from next.config.ts
'salons'    // If defined in config
'analytics' // If defined in config

// Inline object
{ revalidate: 3600, stale: 300, expire: 7200 } // Advanced control
```

### New Cache APIs (Next.js 15.1+)

| API | Availability | Use Case | Semantics |
|-----|-------------|----------|-----------|
| `updateTag(tag)` | Server Actions only | User writes data | Read-your-writes (immediate) |
| `refresh()` | Server Actions only | Client router refresh | Refresh without reload |
| `revalidateTag(tag, profile)` | Server Actions & Route Handlers | Background refresh | Stale-while-revalidate |
| `revalidatePath(path, type)` | Server Actions & Route Handlers | Full route refresh | Entire page/layout |

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
'salons'                          // All salons
`salon:${salonId}`                // Single salon
`salon:${salonId}:reviews`        // Salon reviews
`staff:${staffId}:schedule`       // Staff schedule

// ❌ BAD - Vague or overly generic tags
'data'                            // Too generic
'cache'                           // Not descriptive
'stuff'                           // Meaningless
'items'                           // No context
```

---

## Advanced Caching Strategies (Next.js 15+)

### Multi-Layer Caching Architecture

```
CDN Layer (Vercel Edge)
    ↓
Full Route Cache (Build-time + ISR)
    ↓
Data Cache (fetch with tags)
    ↓
Router Cache (Client-side)
    ↓
Database/External API
```

### Pattern 12: "use cache" Directive (Next.js 15+)

**When to use:** Incremental caching of functions or components without caching entire routes

**Implementation:**
```tsx
// ✅ CORRECT - use cache for function-level caching
// features/business/analytics/api/queries.ts
'use cache'

import { createClient } from '@/lib/supabase/server'
import { cacheTag, cacheLife } from 'next/cache'

export async function getRevenueAnalytics(businessId: string) {
  cacheTag('analytics', `analytics:${businessId}`)
  cacheLife('analytics') // Uses custom profile from next.config.ts

  const supabase = await createClient()
  const { data } = await supabase
    .from('revenue_analytics')
    .select('*')
    .eq('business_id', businessId)

  return data
}

// ✅ CORRECT - use cache for component-level caching
'use cache'

import { cacheTag } from 'next/cache'

export async function AnalyticsWidget({ businessId }: { businessId: string }) {
  cacheTag(`widget:${businessId}`)

  const data = await getRevenueAnalytics(businessId)

  return (
    <div className="analytics-widget">
      <h3>Revenue: ${data.revenue}</h3>
    </div>
  )
}

// ❌ WRONG - Missing cacheTag or cacheLife directives
'use cache'

export async function getAnalytics(businessId: string) {
  // ❌ No cacheTag() - cannot invalidate granularly
  const supabase = await createClient()
  return supabase.from('analytics').select('*').eq('business_id', businessId)
}
```

### Pattern 13: Hybrid Rendering Strategy

**When to use:** Production applications requiring different rendering for different routes

**Implementation:**
```tsx
// ✅ CORRECT - SSG for marketing pages
// app/about/page.tsx
export const dynamic = 'force-static'
export const revalidate = 86400 // 24 hours

export default async function AboutPage() {
  return <AboutContent />
}

// ✅ CORRECT - ISR for semi-dynamic content
// app/blog/[slug]/page.tsx
export const revalidate = 3600 // 1 hour

export default async function BlogPost({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return <PostContent post={post} />
}

// ✅ CORRECT - SSR for user-specific dashboards
// app/(business)/dashboard/page.tsx
export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <DashboardContent userId={user?.id} />
}

// ✅ CORRECT - Edge runtime for auth middleware
// middleware.ts
export const config = {
  runtime: 'edge', // Fast, globally distributed
  matcher: ['/dashboard/:path*', '/api/:path*']
}

export function middleware(request: NextRequest) {
  // Lightweight auth checks at edge
  const token = request.cookies.get('auth-token')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

// ✅ CORRECT - Node.js runtime for complex middleware (15.2+)
// middleware.ts
export const config = {
  runtime: 'nodejs', // Full Node.js API access
  matcher: ['/api/webhooks/:path*']
}

export async function middleware(request: NextRequest) {
  // Complex database operations, TCP connections
  const db = await connectToDatabase()
  const result = await db.query('SELECT * FROM rate_limits WHERE ip = $1', [request.ip])

  if (result.rows[0]?.exceeded) {
    return new NextResponse('Rate limited', { status: 429 })
  }

  return NextResponse.next()
}
```

### Pattern 14: Cache Stampede Prevention

**When to use:** High-traffic routes where multiple requests might trigger expensive regeneration

**Implementation:**
```tsx
// ✅ CORRECT - Stale-while-revalidate pattern
// features/marketing/salons/api/queries.ts
export async function getPopularSalons() {
  const res = await fetch('https://api.example.com/salons/popular', {
    next: {
      tags: ['salons', 'popular'],
      revalidate: 300, // Revalidate every 5 minutes
    },
  })

  return res.json()
}

// Configure cache profile for SWR behavior
// next.config.ts
const nextConfig = {
  cacheLife: {
    salons: {
      stale: 300,       // Serve stale for 5 minutes
      revalidate: 600,  // Revalidate in background after 10 minutes
      expire: 3600,     // Hard expiry after 1 hour
    },
  },
}

// ✅ CORRECT - Request deduplication with React cache
// features/business/dashboard/api/queries.ts
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

// Deduplicate requests within same render
export const getBusinessStats = cache(async (businessId: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('business_stats')
    .select('*')
    .eq('id', businessId)
    .single()

  return data
})

// Multiple components can call this - only executes once per render
export async function StatCard({ businessId }: { businessId: string }) {
  const stats = await getBusinessStats(businessId) // Deduped
  return <div>{stats.total_revenue}</div>
}

export async function MetricsPanel({ businessId }: { businessId: string }) {
  const stats = await getBusinessStats(businessId) // Uses cached result
  return <div>{stats.appointments_count}</div>
}
```

### Pattern 15: Tag Hierarchy and Invalidation Strategy

**When to use:** Complex data dependencies requiring granular cache control

**Implementation:**
```tsx
// ✅ CORRECT - Hierarchical tag naming
const tags = {
  // Top-level resource tags
  appointments: 'appointments',
  salons: 'salons',
  staff: 'staff',

  // Business-scoped tags
  businessAppointments: (businessId: string) => `appointments:business:${businessId}`,
  businessSalons: (businessId: string) => `salons:business:${businessId}`,

  // Resource-specific tags
  appointment: (id: string) => `appointment:${id}`,
  salon: (id: string) => `salon:${id}`,
  salonReviews: (salonId: string) => `salon:${salonId}:reviews`,
  salonStaff: (salonId: string) => `salon:${salonId}:staff`,
  staffSchedule: (staffId: string) => `staff:${staffId}:schedule`,
}

// ✅ CORRECT - Strategic invalidation
'use server'

export async function createAppointment(input: AppointmentInput) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('appointments')
    .insert(input)
    .select()
    .single()

  // Invalidate from specific to general
  updateTag(tags.appointment(data.id))                    // Single appointment
  updateTag(tags.businessAppointments(data.business_id))  // Business appointments
  updateTag(tags.staffSchedule(data.staff_id))            // Staff schedule
  updateTag(tags.appointments)                            // All appointments (admin)

  revalidatePath('/business/appointments', 'page')
}

export async function deleteAppointment(appointmentId: string) {
  const supabase = await createClient()

  // Fetch before delete to know what to invalidate
  const { data: appointment } = await supabase
    .from('appointments')
    .select('business_id, staff_id, salon_id')
    .eq('id', appointmentId)
    .single()

  await supabase.from('appointments').delete().eq('id', appointmentId)

  // Invalidate hierarchically
  updateTag(tags.appointment(appointmentId))
  updateTag(tags.businessAppointments(appointment.business_id))
  updateTag(tags.staffSchedule(appointment.staff_id))
  updateTag(tags.salonStaff(appointment.salon_id))

  revalidatePath('/business/appointments', 'page')
}

// ❌ WRONG - Flat, non-hierarchical tags
const badTags = {
  appointments1: 'appts',              // Abbreviation unclear
  appointments2: 'appointment-data',   // No hierarchy
  appointments3: 'business-appointments', // Not parameterized
}
```

---

## Performance Optimization

### Pattern 16: Streaming with Nested Suspense Boundaries

**When to use:** Complex pages with multiple data dependencies

**Implementation:**
```tsx
// ✅ CORRECT - Granular streaming with priority
// app/(business)/dashboard/page.tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Critical data - small boundary, fast */}
      <Suspense fallback={<QuickStatsSkeleton />}>
        <QuickStats />
      </Suspense>

      <div className="grid grid-cols-2 gap-6">
        {/* Medium priority - independent streams */}
        <Suspense fallback={<AppointmentsSkeleton />}>
          <RecentAppointments />
        </Suspense>

        <Suspense fallback={<RevenueSkeleton />}>
          <RevenueChart />
        </Suspense>
      </div>

      {/* Low priority - slow analytics */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <DetailedAnalytics />
      </Suspense>
    </div>
  )
}

// ✅ CORRECT - Nested Suspense for complex component
async function DetailedAnalytics() {
  const basicStats = await getBasicAnalytics() // Fast query

  return (
    <div className="analytics-container">
      <h2>Analytics Overview</h2>
      <BasicStatsDisplay data={basicStats} />

      {/* Nested Suspense for slow sub-component */}
      <Suspense fallback={<ChartSkeleton />}>
        <ComplexChart /> {/* Slow aggregation query */}
      </Suspense>
    </div>
  )
}

// ❌ WRONG - Single Suspense boundary blocks everything
export default function Dashboard() {
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <DashboardContent /> {/* All data fetched sequentially */}
    </Suspense>
  )
}
```

### Pattern 17: Parallel Data Fetching (Avoiding Waterfalls)

**When to use:** Multiple independent data sources needed for single page

**Implementation:**
```tsx
// ✅ CORRECT - Parallel Promise.all
// app/(business)/salons/[salonId]/page.tsx
async function SalonDetail({ salonId }: { salonId: string }) {
  const supabase = await createClient()

  // ✅ All queries execute in parallel
  const [salon, staff, reviews, services] = await Promise.all([
    supabase.from('salons').select('*').eq('id', salonId).single(),
    supabase.from('staff').select('*').eq('salon_id', salonId),
    supabase.from('reviews').select('*').eq('salon_id', salonId).limit(10),
    supabase.from('services').select('*').eq('salon_id', salonId),
  ])

  return (
    <div>
      <SalonHeader salon={salon.data} />
      <StaffList staff={staff.data} />
      <ReviewsSection reviews={reviews.data} />
      <ServicesGrid services={services.data} />
    </div>
  )
}

// ❌ WRONG - Sequential waterfall
async function SalonDetail({ salonId }: { salonId: string }) {
  const supabase = await createClient()

  // ❌ Each await blocks next query
  const salon = await supabase.from('salons').select('*').eq('id', salonId).single()
  const staff = await supabase.from('staff').select('*').eq('salon_id', salonId)
  const reviews = await supabase.from('reviews').select('*').eq('salon_id', salonId)

  return <SalonContent salon={salon} staff={staff} reviews={reviews} />
}

// ✅ CORRECT - Component-level parallelism with Suspense
export default function SalonPage({ params }: { params: Promise<{ salonId: string }> }) {
  return (
    <div>
      {/* All components fetch in parallel */}
      <Suspense fallback={<HeaderSkeleton />}>
        <SalonHeader params={params} />
      </Suspense>

      <div className="grid grid-cols-2 gap-6">
        <Suspense fallback={<StaffSkeleton />}>
          <StaffList params={params} />
        </Suspense>

        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsSection params={params} />
        </Suspense>
      </div>
    </div>
  )
}
```

### Partial Prerendering (Experimental - NOT Production Ready)

**Status:** Experimental in Next.js 15.5, NOT recommended for production

```tsx
// ⚠️ EXPERIMENTAL - Enable in next.config.ts
const nextConfig = {
  experimental: {
    ppr: 'incremental', // Opt-in per route
  },
}

// ⚠️ EXPERIMENTAL - Opt-in at route level
// app/products/page.tsx
export const experimental_ppr = true

export default function ProductsPage() {
  return (
    <div>
      {/* Static shell prerendered */}
      <Header />
      <Nav />

      {/* Dynamic content streamed */}
      <Suspense fallback={<ProductsSkeleton />}>
        <Products /> {/* Fetches at runtime */}
      </Suspense>

      {/* Static footer prerendered */}
      <Footer />
    </div>
  )
}

// ⚠️ DO NOT USE IN PRODUCTION - Wait for stable release
```

---

## Security Hardening

### Pattern 18: Content Security Policy (CSP) with Nonces

**When to use:** Production applications requiring XSS protection

**Implementation:**
```tsx
// ✅ CORRECT - CSP middleware with nonces
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export function middleware(request: NextRequest) {
  // Generate unique nonce for this request
  const nonce = randomBytes(16).toString('base64')

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' blob: data: https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ')

  const response = NextResponse.next()

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )

  // Pass nonce to page via header
  response.headers.set('x-nonce', nonce)

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

// ✅ CORRECT - Use nonce in layout
// app/layout.tsx
import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const nonce = headersList.get('x-nonce') ?? undefined

  return (
    <html lang="en">
      <head>
        <script nonce={nonce} src="/analytics.js" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Pattern 19: Rate Limiting with Upstash Redis

**When to use:** API routes and Server Actions requiring abuse prevention

**Implementation:**
```tsx
// ✅ CORRECT - Rate limiting middleware
// lib/rate-limit.ts
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const redis = Redis.fromEnv()

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
  analytics: true,
})

// ✅ CORRECT - Apply to Route Handler
// app/api/bookings/route.ts
import { ratelimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    )
  }

  // Process booking
  return NextResponse.json({ success: true })
}

// ✅ CORRECT - Apply to Server Action
'use server'

import { ratelimit } from '@/lib/rate-limit'

export async function createReview(input: ReviewInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Rate limit by user ID
  const { success } = await ratelimit.limit(user.id)

  if (!success) {
    throw new Error('Too many requests. Please try again later.')
  }

  // Create review
  const { data } = await supabase.from('reviews').insert(input).select().single()

  updateTag(`salon:${input.salon_id}:reviews`)
  updateTag(`reviews`)

  return data
}
```

---

## Monitoring and Observability

### Pattern 20: OpenTelemetry Instrumentation

**When to use:** Production applications requiring distributed tracing

**Implementation:**
```tsx
// ✅ CORRECT - Enable OpenTelemetry
// instrumentation.ts (root of project)
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerOTel } = await import('@vercel/otel')

    registerOTel({
      serviceName: 'enorae-app',
      tracesSampleRate: 1.0, // 100% in development, 0.1 in production
    })
  }
}

// ✅ CORRECT - Custom spans for performance tracking
// features/business/appointments/api/mutations.ts
'use server'

import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('appointments-service')

export async function createAppointment(input: AppointmentInput) {
  return tracer.startActiveSpan('create-appointment', async (span) => {
    try {
      span.setAttribute('appointment.salon_id', input.salon_id)
      span.setAttribute('appointment.service_id', input.service_id)

      const supabase = await createClient()

      // Child span for database operation
      const dbSpan = tracer.startSpan('db.insert.appointment')
      const { data, error } = await supabase
        .from('appointments')
        .insert(input)
        .select()
        .single()
      dbSpan.end()

      if (error) {
        span.recordException(error)
        span.setStatus({ code: 2, message: error.message })
        throw error
      }

      // Child span for cache invalidation
      const cacheSpan = tracer.startSpan('cache.invalidate')
      updateTag(`appointment:${data.id}`)
      updateTag('appointments')
      cacheSpan.end()

      span.setStatus({ code: 1 })
      return data
    } finally {
      span.end()
    }
  })
}

// ✅ CORRECT - Environment variables
// .env.local
NEXT_OTEL_VERBOSE=1                    # Verbose logging
OTEL_EXPORTER_OTLP_ENDPOINT=https://...# Your observability backend
OTEL_SERVICE_NAME=enorae-app
```

### Pattern 21: Error Tracking and Logging

**When to use:** Production applications requiring error monitoring

**Implementation:**
```tsx
// ✅ CORRECT - Global error boundary
// app/error.tsx
'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// ✅ CORRECT - Server-side error logging
// features/business/appointments/api/mutations.ts
'use server'

import { logger } from '@/lib/logger'

export async function createAppointment(input: AppointmentInput) {
  try {
    logger.info('Creating appointment', { input })

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('appointments')
      .insert(input)
      .select()
      .single()

    if (error) {
      logger.error('Failed to create appointment', { error, input })
      throw error
    }

    logger.info('Appointment created', { appointmentId: data.id })
    return data
  } catch (error) {
    logger.error('Unexpected error creating appointment', { error })
    throw error
  }
}

// ✅ CORRECT - Structured logging
// lib/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})
```

---

## Deployment and Production Patterns

### Rendering Strategy Decision Matrix

| Content Type | Rendering | Revalidation | Use Case |
|--------------|-----------|--------------|----------|
| Marketing pages | SSG | None or daily | About, Pricing, Terms |
| Blog posts | ISR | 1 hour | Article content |
| Product listings | ISR | 5 minutes | E-commerce catalog |
| User dashboard | SSR | N/A | Personalized data |
| Search results | SSR | N/A | Real-time queries |
| Static assets | SSG | None | Images, fonts, docs |

### Pattern 22: Edge vs Node.js Runtime Decision

**Edge Runtime (Fast, globally distributed):**
```tsx
// ✅ CORRECT - Edge for simple auth checks
// middleware.ts
export const config = {
  runtime: 'edge',
  matcher: ['/dashboard/:path*']
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// ✅ CORRECT - Edge for geolocation routing
export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US'

  if (country === 'CN') {
    return NextResponse.rewrite(new URL('/cn', request.url))
  }

  return NextResponse.next()
}
```

**Node.js Runtime (Full ecosystem access):**
```tsx
// ✅ CORRECT - Node.js for database operations (15.2+)
// middleware.ts
export const config = {
  runtime: 'nodejs',
  matcher: ['/api/:path*']
}

import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  // Complex database query with TCP connection
  const supabase = await createClient()

  const { data } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('ip_address', request.ip)
    .single()

  if (data?.is_blocked) {
    return new NextResponse('Blocked', { status: 403 })
  }

  return NextResponse.next()
}

// ✅ CORRECT - Node.js for file system operations
export async function middleware(request: NextRequest) {
  const fs = await import('fs/promises')
  const config = await fs.readFile('./config.json', 'utf-8')

  // Process based on config
  return NextResponse.next()
}
```

---

## File Conventions

### App Router File Structure

| File | Purpose | Required | Notes |
|------|---------|----------|-------|
| `layout.tsx` | Persistent shell for segment | Yes (root) | Can be async; receives params as Promise |
| `page.tsx` | Route entry point | Yes | Can be async; receives params/searchParams as Promises |
| `loading.tsx` | Suspense fallback | No | Server Component; render skeletons |
| `error.tsx` | Error boundary UI | No | Must be `'use client'`; receives error and reset |
| `not-found.tsx` | 404 for segment | No | Server Component; triggered by notFound() |
| `default.tsx` | Parallel route fallback | Yes (parallel) | REQUIRED for parallel routes in Next.js 16 |
| `route.ts` | API/Route handler | No | Export HTTP methods (GET, POST, etc.) |
| `template.tsx` | Re-render on navigation | No | Useful for animations; not cached |

### Route Segment Config Options

```tsx
// app/dashboard/page.tsx

// Force dynamic rendering (never cache)
export const dynamic = 'force-dynamic'

// Force static generation (always cache)
export const dynamic = 'force-static'

// Revalidate entire route every N seconds
export const revalidate = 3600 // 1 hour

// Control fetch cache behavior
export const fetchCache = 'default-cache'

// Runtime: 'nodejs' | 'edge'
export const runtime = 'nodejs'
```

---

## Detection Commands

```bash
# Find page/layout files accessing params without awaiting
rg "params\." app features --type tsx -B 2 | grep -v "await params"

# Find searchParams access without await
rg "searchParams\." app features --type tsx -B 2 | grep -v "await searchParams"

# Find cookies() without await
rg "cookies\(\)" --type ts --type tsx -B 1 | grep -v "await"

# Find headers() without await
rg "headers\(\)" --type ts --type tsx -B 1 | grep -v "await"

# Find createClient() without await
rg "createClient\(\)" --type ts --type tsx -B 2 | grep -v "await createClient"

# Find revalidateTag without cache profile
rg "revalidateTag\(['\"][^'\"]+['\"]\)(?!\s*,)" --type ts --type tsx

# Find revalidatePath without type parameter
rg "revalidatePath\(['\"][^'\"]+['\"]\)(?!\s*,)" --type ts --type tsx

# Find parallel routes missing default.tsx
find app -type d -name "@*" -exec sh -c '[ ! -f "$1/default.tsx" ] && echo "Missing: $1/default.tsx"' _ {} \;

# Ensure Server Actions declare 'use server'
rg --files -g 'mutations.ts' -g 'actions.ts' | xargs -I{} sh -c "grep -L \"'use server'\" {}"

# Identify client components missing 'use client' while using hooks
rg "(useState|useEffect|useActionState|useOptimistic)" app features --type tsx \
  | xargs -I{} sh -c "grep -L \"'use client'\" {}"

# Catch legacy Pages Router functions
rg "getServerSideProps|getStaticProps|getInitialProps" --type ts --type tsx

# Find generic cache tag names
rg "revalidateTag\(['\"](data|cache|stuff|items)['\"]" --type ts --type tsx

# Find async Client Components (invalid)
rg "'use client'" app features --type tsx -A 3 | grep "export default async function"

# Find updateTag() used outside Server Actions
rg "updateTag\(" --type ts --type tsx | xargs -I{} sh -c "grep -L \"'use server'\" {}"

# Find refresh() used outside Server Actions
rg "refresh\(\)" --type ts --type tsx | xargs -I{} sh -c "grep -L \"'use server'\" {}"

# Find fetch requests without explicit cache option (Next.js 15+)
rg "fetch\(['\"]https?://" --type ts --type tsx -A 2 | grep -v "cache:"

# Find unstable_cacheLife imports (should be cacheLife)
rg "unstable_cacheLife" --type ts --type tsx

# Find Route Handlers assuming cached GET (Next.js 15+)
rg "export async function GET" app --type ts -B 2 | grep -v "dynamic = 'force-static'"

# Find 'use cache' without cacheTag() or cacheLife()
rg "'use cache'" --type ts --type tsx -A 10 | grep -L "cacheTag\|cacheLife"

# Find sequential data fetching (waterfall pattern)
rg "const .+ = await" app features --type tsx -A 1 -B 1 | grep -A 1 "const .+ = await" | grep -v "Promise.all"

# Find missing CSP headers in middleware
rg "export.*function middleware" --type ts -A 20 | grep -L "Content-Security-Policy"

# Find public API routes without rate limiting
rg "export async function POST" app/api --type ts -A 10 | grep -L "ratelimit"

# Find production apps without OpenTelemetry
test ! -f instrumentation.ts && echo "Missing: instrumentation.ts for OpenTelemetry"

# Find PPR enabled in production (experimental)
rg "experimental_ppr.*true" --type ts --type tsx

# Find Edge runtime used for database operations
rg "runtime.*edge" middleware.ts -A 10 | grep "createClient\|supabase"

# Find single Suspense wrapping entire page
rg "<Suspense" app --type tsx | awk '{print $1}' | sort | uniq -c | awk '$1 == 1'

# Find components not using Promise.all for parallel queries
rg "await supabase" app features --type tsx -A 1 | grep -A 1 "await supabase" | grep -v "Promise.all"

# Find middleware without proper security headers
rg "export.*middleware" --type ts -A 30 | grep -L "X-Content-Type-Options\|X-Frame-Options"

# Find Server Actions without error logging
rg "'use server'" --type ts -A 30 | grep -L "try.*catch\|logger"

# Find uncached fetch requests that should be cached
rg "fetch.*next.*tags" --type ts -A 2 | grep -v "cache: 'force-cache'"
```

---

## Quick Reference

| Pattern | When | Example | Since |
|---------|------|---------|-------|
| Async page | Always with params/searchParams | `const { id } = await params` | 15.0 |
| updateTag | Server Action writes (immediate) | `updateTag('appointments')` | 15.1 |
| refresh | Client router refresh | `refresh()` | 15.1 |
| revalidateTag | Background refresh | `revalidateTag('appointments', 'max')` | 15.0 |
| revalidatePath | After delete/major change | `revalidatePath('/dashboard', 'page')` | 15.0 |
| use cache | Function/component caching | `'use cache'` + `cacheTag('resource')` | 15.0 |
| Fetch cache | Explicit caching required | `fetch(url, { cache: 'force-cache' })` | 15.0 |
| Fetch tags | With cache invalidation | `fetch(url, { next: { tags: ['users'] } })` | 13.0 |
| No cache | Always fresh | `fetch(url, { cache: 'no-store' })` | 13.0 |
| Suspense | Slow data sections | `<Suspense fallback={<Skeleton />}>` | 13.0 |
| Parallel data | Avoid waterfalls | `Promise.all([query1, query2])` | All |
| Parallel route | Modals/conditional UI | `@modal/default.tsx` required | 15.0 |
| Route Handler | Webhooks/non-form API | `export async function POST(request)` | 13.0 |
| Client params | React hooks needed | `const { id } = use(params)` | 15.0 |
| CSP Headers | Production security | Middleware with nonces | All |
| Rate Limiting | API abuse prevention | Upstash Redis + middleware | All |
| OpenTelemetry | Production observability | `instrumentation.ts` + `@vercel/otel` | 13.0 |
| Edge Runtime | Fast auth/routing | `runtime: 'edge'` in config | All |
| Node.js Runtime | DB/file operations | `runtime: 'nodejs'` in config | 15.2 |
| SSG | Static marketing pages | `dynamic = 'force-static'` | All |
| ISR | Semi-dynamic content | `revalidate = 3600` | All |
| SSR | User-specific data | `dynamic = 'force-dynamic'` | All |

---

## Migration Checklist (Next.js 14 → 15/15.5)

**Breaking Changes:**
- [ ] All page/layout functions with params are async and await params
- [ ] All searchParams access uses await
- [ ] All cookies() calls are awaited
- [ ] All headers() calls are awaited
- [ ] All draftMode() calls are awaited
- [ ] All createClient() calls are awaited (Supabase)
- [ ] All revalidateTag() calls include cache profile (second parameter)
- [ ] All revalidatePath() calls include type parameter ('page' | 'layout')
- [ ] All parallel route slots have default.tsx files
- [ ] All fetch requests explicitly set cache option (`cache: 'force-cache'` or `cache: 'no-store'`)
- [ ] Route Handler GET methods set `dynamic = 'force-static'` if caching needed
- [ ] No getServerSideProps/getStaticProps in codebase
- [ ] No serverRuntimeConfig/publicRuntimeConfig usage
- [ ] Cache tags are hierarchical and descriptive

**New Features to Adopt (Next.js 15.1+):**
- [ ] Server Actions use updateTag() for immediate writes (read-your-writes)
- [ ] Server Actions use refresh() for client router updates
- [ ] Server Actions use revalidateTag() for background updates (stale-while-revalidate)
- [ ] Import cacheLife (not unstable_cacheLife) for cache profiles
- [ ] Consider enabling Turbopack file system caching (`experimental.turbopackFileSystemCacheForDev`)

**Advanced Caching (Next.js 15+):**
- [ ] Implement 'use cache' directive with cacheTag() for granular invalidation
- [ ] Use React cache() for request deduplication within same render
- [ ] Configure custom cacheLife profiles in next.config.ts
- [ ] Implement hierarchical cache tag naming convention
- [ ] Use Promise.all() for parallel data fetching (avoid waterfalls)

**Performance Optimization:**
- [ ] Add granular Suspense boundaries (not single page-level boundary)
- [ ] Implement nested Suspense for complex components
- [ ] Use component-level parallelism with Suspense
- [ ] Avoid sequential data fetching patterns
- [ ] Consider PPR for future (still experimental, NOT production-ready)

**Security Hardening (Production Apps):**
- [ ] Implement Content Security Policy (CSP) with nonces in middleware
- [ ] Add comprehensive security headers (X-Frame-Options, HSTS, etc.)
- [ ] Implement rate limiting for public API routes (Upstash Redis)
- [ ] Rate limit Server Actions by user ID
- [ ] Validate CSP policy with Google CSP Evaluator

**Monitoring and Observability (Production Apps):**
- [ ] Add OpenTelemetry instrumentation (`instrumentation.ts`)
- [ ] Use @vercel/otel for simplified setup
- [ ] Implement custom spans for critical operations
- [ ] Add structured logging with pino or similar
- [ ] Set up error tracking (Sentry or similar)
- [ ] Configure NEXT_OTEL_VERBOSE for debugging

**Runtime Optimization (Next.js 15.2+):**
- [ ] Use Edge runtime for simple auth checks and routing
- [ ] Use Node.js runtime for database operations and file system access
- [ ] Choose appropriate runtime for middleware operations
- [ ] Avoid Edge runtime for heavy computational tasks

**Deployment Strategy:**
- [ ] Use SSG for marketing pages with daily/no revalidation
- [ ] Use ISR for semi-dynamic content (blog posts, product listings)
- [ ] Use SSR for user-specific dashboards and real-time data
- [ ] Implement hybrid rendering strategy across application
- [ ] Configure appropriate revalidate times per route

**Next.js 16 Preparation (Coming Soon):**
- [ ] Rename middleware.ts to proxy.ts (when upgrading to Next.js 16)
- [ ] Update skipMiddlewareUrlNormalize to skipProxyUrlNormalize
- [ ] Review parallel routes for default.tsx requirement

---

**Related:**
- [03-react.md](./03-react.md) - Server vs Client Components
- [05-database.md](./05-database.md) - Supabase patterns with Next.js
- [06-api.md](./06-api.md) - Server Actions vs Route Handlers
- [07-forms.md](./07-forms.md) - Form handling with Server Actions
