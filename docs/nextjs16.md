# Next.js 16 Rules & Patterns

**Reusable reference for Next.js 15 → Next.js 16 pattern changes**

---

## Quick Reference Table

| Category | Old Pattern (❌ Next.js 15) | New Pattern (✅ Next.js 16) | Impact |
|----------|---------------------------|---------------------------|--------|
| **Route params** | Sync `params.id` | Async `await params` then `params.id` | HIGH |
| **Search params** | Sync `searchParams.q` | Async `await searchParams` then `searchParams.q` | HIGH |
| **cookies()** | Sync `cookies().get()` | Async `await cookies()` then `.get()` | HIGH |
| **headers()** | Sync `headers().get()` | Async `await headers()` then `.get()` | HIGH |
| **draftMode()** | Sync `draftMode().isEnabled` | Async `await draftMode()` then `.isEnabled` | HIGH |
| **revalidateTag()** | `revalidateTag('tag')` | `revalidateTag('tag', 'max')` | HIGH |
| **revalidatePath()** | `revalidatePath('/path')` | `revalidatePath('/path', 'layout')` | MEDIUM |
| **middleware.ts** | File: `middleware.ts` | File: `proxy.ts` | MEDIUM |
| **middleware export** | `export function middleware` | `export default function proxy` | MEDIUM |
| **matcher config** | `matcher: '/api/*'` | `matcher: ['/api/*']` | MEDIUM |
| **Parallel routes** | No `default.tsx` required | All slots need `default.tsx` | MEDIUM |
| **Node.js** | 18.17.0+ | 20.9.0+ | MEDIUM |
| **TypeScript** | 4.5.0+ | 5.1.0+ | LOW |

---

## Rule 1: Route Params Must Be Async

### Old Way (❌ Next.js 15)
```tsx
// app/salons/[salonId]/page.tsx
export default function Page({
  params
}: {
  params: { salonId: string }
}) {
  return <div>Salon {params.salonId}</div>
}
```

### New Way (✅ Next.js 16)
```tsx
// app/salons/[salonId]/page.tsx
export default async function Page({
  params
}: {
  params: Promise<{ salonId: string }>
}) {
  const { salonId } = await params
  return <div>Salon {salonId}</div>
}
```

### Detection Command
```bash
rg "params\." app --type tsx -B 2 | grep -v "await params"
```

### Why Changed
- Enables streaming and suspense boundaries at param level
- Prepares for future async routing optimizations
- Allows params to be fetched lazily

### Common Mistakes
❌ Accessing param directly: `params.salonId`
❌ Not making function async: `function Page({params})`
❌ Wrong type: `params: { salonId: string }`

---

## Rule 2: searchParams Must Be Async

### Old Way (❌ Next.js 15)
```tsx
// app/search/page.tsx
export default function Page({
  searchParams
}: {
  searchParams: { query: string; page: string }
}) {
  return <SearchResults query={searchParams.query} />
}
```

### New Way (✅ Next.js 16)
```tsx
// app/search/page.tsx
export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ query: string; page: string }>
}) {
  const { query, page } = await searchParams
  return <SearchResults query={query} page={page} />
}
```

### Detection Command
```bash
rg "searchParams\." app --type tsx -B 2 | grep -v "await searchParams"
```

### Why Changed
- Allows search params to be lazily evaluated
- Improves initial page load performance
- Enables partial prerendering for pages with search params

### Common Mistakes
❌ Direct access: `searchParams.query`
❌ Missing await: `const query = searchParams.query`
❌ Not updating type to Promise

---

## Rule 3: cookies() Must Be Async

### Old Way (❌ Next.js 15)
```ts
// lib/auth/session.ts
import { cookies } from 'next/headers'

export function getSession() {
  const sessionCookie = cookies().get('session')
  return sessionCookie?.value
}
```

### New Way (✅ Next.js 16)
```ts
// lib/auth/session.ts
import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  return sessionCookie?.value
}
```

### Detection Command
```bash
rg "cookies\(\)" --type ts -B 1 | grep -v "await"
```

### Why Changed
- Enables async cookie operations for edge runtime
- Prepares for lazy cookie evaluation
- Improves compatibility with streaming

### Common Mistakes
❌ Direct chaining: `cookies().get('name')`
❌ Not awaiting: `const cookieStore = cookies()`
❌ Not making function async

---

## Rule 4: headers() Must Be Async

### Old Way (❌ Next.js 15)
```ts
// lib/api/get-user-agent.ts
import { headers } from 'next/headers'

export function getUserAgent() {
  const userAgent = headers().get('user-agent')
  return userAgent
}
```

### New Way (✅ Next.js 16)
```ts
// lib/api/get-user-agent.ts
import { headers } from 'next/headers'

export async function getUserAgent() {
  const headerStore = await headers()
  const userAgent = headerStore.get('user-agent')
  return userAgent
}
```

### Detection Command
```bash
rg "headers\(\)" --type ts -B 1 | grep -v "await"
```

### Why Changed
- Consistent API with cookies()
- Enables lazy header evaluation
- Better streaming support

### Common Mistakes
❌ Chaining: `headers().get('name')`
❌ Not awaiting
❌ Using in Client Components (never allowed)

---

## Rule 5: draftMode() Must Be Async

### Old Way (❌ Next.js 15)
```ts
// lib/cms/draft.ts
import { draftMode } from 'next/headers'

export function isDraft() {
  return draftMode().isEnabled
}
```

### New Way (✅ Next.js 16)
```ts
// lib/cms/draft.ts
import { draftMode } from 'next/headers'

export async function isDraft() {
  const draft = await draftMode()
  return draft.isEnabled
}
```

### Detection Command
```bash
rg "draftMode\(\)" --type ts -B 1 | grep -v "await"
```

### Why Changed
- Consistent with cookies() and headers()
- Enables lazy evaluation

---

## Rule 6: revalidateTag() Requires Cache Profile

### Old Way (❌ Next.js 15)
```ts
// features/business/services/api/mutations.ts
import { revalidateTag } from 'next/cache'

export async function updateService() {
  await db.services.update()
  revalidateTag('services')
}
```

### New Way (✅ Next.js 16)
```ts
// features/business/services/api/mutations.ts
import { revalidateTag } from 'next/cache'

export async function updateService() {
  await db.services.update()

  // Use 'max' for most cases (SWR behavior)
  revalidateTag('services', 'max')

  // Or use custom revalidation time
  revalidateTag('services', { revalidate: 3600 })

  // Or use named profile from config
  revalidateTag('services', 'hours')
}
```

### Detection Command
```bash
rg "revalidateTag\(['\"][\w-]+['\"]\)(?!\s*,)" --type ts
```

### Why Changed
- Enables stale-while-revalidate (SWR) behavior
- More explicit cache control
- Better performance for static content

### Common Mistakes
❌ Single argument: `revalidateTag('tag')`
❌ Wrong profile: `revalidateTag('tag', 'invalid')`

### Cache Profile Options
```ts
// Built-in profiles
'max'   // Recommended for most cases
'hours' // Revalidate after hours
'days'  // Revalidate after days

// Custom profile from next.config.ts
'salons'    // If defined in config
'analytics' // If defined in config

// Inline object
{ revalidate: 3600 } // 1 hour in seconds
```

---

## Rule 7: revalidatePath() Requires Type Parameter

### Old Way (❌ Next.js 15)
```ts
import { revalidatePath } from 'next/cache'

revalidatePath('/dashboard')
```

### New Way (✅ Next.js 16)
```ts
import { revalidatePath } from 'next/cache'

// For layout and all nested pages
revalidatePath('/dashboard', 'layout')

// For single page only
revalidatePath('/dashboard', 'page')
```

### Detection Command
```bash
rg "revalidatePath\(['\"][^'\"]+['\"]\)(?!\s*,)" --type ts
```

### Why Changed
- More explicit control over revalidation scope
- Prevents accidental over-invalidation
- Better performance

---

## Rule 8: middleware.ts → proxy.ts

### Old Way (❌ Next.js 15)
```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/api/:path*'
}
```

### New Way (✅ Next.js 16)
```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: ['/api/:path*']  // Must be array
}
```

### Detection Command
```bash
# Check if middleware.ts exists
ls -la middleware.ts 2>/dev/null

# Find middleware exports
rg "export function middleware" --type ts
```

### Why Changed
- Clearer naming (proxy reflects network boundary)
- Runs on Node.js runtime (not Edge)
- More explicit about purpose

### Migration Steps
```bash
# 1. Rename file
mv middleware.ts proxy.ts

# 2. Update export
sed -i '' 's/export function middleware/export default function proxy/g' proxy.ts

# 3. Update matcher to array
sed -i '' "s/matcher: '\(.*\)'/matcher: ['\1']/g" proxy.ts
```

### Common Mistakes
❌ Not renaming file
❌ Not changing export to default
❌ Not wrapping matcher in array
❌ Using Edge runtime (use Node.js)

---

## Rule 9: Parallel Routes Require default.tsx

### Old Way (❌ Next.js 15)
```
app/
  @modal/
    login/
      page.tsx
  layout.tsx
```

### New Way (✅ Next.js 16)
```
app/
  @modal/
    default.tsx  ← REQUIRED
    login/
      page.tsx
  layout.tsx
```

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null
}

// Or use notFound()
import { notFound } from 'next/navigation'

export default function Default() {
  notFound()
}
```

### Detection Command
```bash
# Find all parallel route slots
find app -type d -name "@*"

# Check for missing default.tsx
for dir in $(find app -type d -name "@*"); do
  if [ ! -f "$dir/default.tsx" ]; then
    echo "Missing: $dir/default.tsx"
  fi
done
```

### Why Changed
- Explicit fallback behavior
- Prevents build errors
- Better error handling

---

## Rule 10: Supabase createClient Must Be Async

### Old Way (❌ Next.js 15)
```ts
// lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function createClient() {
  const cookieStore = cookies()  // Sync

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

// Usage in queries
const supabase = createClient()  // Sync
const { data } = await supabase.from('salons').select()
```

### New Way (✅ Next.js 16)
```ts
// lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  const cookieStore = await cookies()  // Async

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

// Usage in queries (must await createClient)
const supabase = await createClient()  // Async
const { data } = await supabase.from('salons').select()
```

### Detection Command
```bash
# Find createClient calls without await
rg "createClient\(\)" --type ts -B 2 | grep -v "await createClient"
```

### Impact on ENORAE
🚨 **CRITICAL:** All query and mutation files must be updated!

```ts
// features/business/services/api/queries.ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

// OLD - Won't work in Next.js 16
export async function getServices() {
  const supabase = createClient()  // ❌ Missing await
  const { data } = await supabase.from('services_view').select()
  return data
}

// NEW - Next.js 16
export async function getServices() {
  const supabase = await createClient()  // ✅ Awaited
  const { data } = await supabase.from('services_view').select()
  return data
}
```

---

## New APIs in Next.js 16

### API 1: updateTag() - Read-Your-Writes

**Use Case:** Server Actions that need immediate cache refresh

```ts
'use server'

import { updateTag } from 'next/cache'

export async function updateUserProfile(userId: string, profile: Profile) {
  // Update database
  await db.profiles.update(userId, profile)

  // Expire cache AND refresh immediately
  // User sees their changes right away
  updateTag(`user-${userId}`)
}
```

**vs revalidateTag():**
- `revalidateTag()` - Stale-while-revalidate (SWR), background refresh
- `updateTag()` - Immediate expiry and refresh, read-your-writes

---

### API 2: refresh() - Refresh Uncached Data

**Use Case:** Refresh dynamic data without touching cache

```ts
'use server'

import { refresh } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  // Update database
  await db.notifications.markAsRead(notificationId)

  // Refresh uncached notification count in header
  // Cached page shells remain fast
  refresh()
}
```

**vs router.refresh():**
- `refresh()` - Server-side, in Server Actions
- `router.refresh()` - Client-side, in Client Components

---

### API 3: "use cache" Directive - Cache Components

**Use Case:** Opt-in component caching with PPR

```tsx
// app/components/expensive-dashboard.tsx
'use cache'

export async function ExpensiveDashboard() {
  const data = await fetchExpensiveData()
  return <DashboardView data={data} />
}
```

**Enable in config:**
```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true,
}
```

---

## Removed/Deprecated Features

### ❌ Removed in Next.js 16

| Feature | Replacement |
|---------|-------------|
| `useAmp()` | None - AMP fully removed |
| `export const config = { amp: true }` | None - Use standard pages |
| `next lint` command | Use `eslint` or `biome` directly |
| `serverRuntimeConfig` | Environment variables (`.env`) |
| `publicRuntimeConfig` | Environment variables (`.env`) |
| `experimental.turbopack` flag | Top-level `turbopack` config |
| `experimental.ppr` flag | `cacheComponents` config |
| `export const experimental_ppr` | Remove - evolving to Cache Components |

### ⚠️ Deprecated (Still works, will be removed)

| Feature | Replacement | Timeline |
|---------|-------------|----------|
| `middleware.ts` filename | `proxy.ts` | Future major version |
| `next/legacy/image` | `next/image` | Future major version |
| `images.domains` config | `images.remotePatterns` | Future major version |
| `revalidateTag(tag)` single arg | `revalidateTag(tag, profile)` | Future major version |

---

## Configuration Changes

### next.config.ts Updates

**Old Config (❌ Next.js 15):**
```ts
// next.config.ts
const nextConfig = {
  experimental: {
    serverActions: true,      // ❌ Remove
    ppr: true,               // ❌ Remove
    turbopack: true,         // ❌ Move to top-level
  },
}
```

**New Config (✅ Next.js 16):**
```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turbopack is default, no config needed
  // Or explicitly configure:
  turbopack: true,

  // New cache components
  cacheComponents: true,

  // Configure cache profiles
  cacheLife: {
    default: {
      stale: 300,      // 5 minutes
      revalidate: 900, // 15 minutes
      expire: 3600,    // 1 hour
    },
    salons: {
      stale: 900,
      revalidate: 3600,
      expire: 86400,
    },
  },

  // React compiler (stable but opt-in)
  reactCompiler: true,

  // Filesystem caching (beta)
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}

export default nextConfig
```

---

## Version Requirements

### Minimum Versions

| Dependency | Old | New | Breaking |
|-----------|-----|-----|----------|
| **Node.js** | 18.17.0 | **20.9.0** | ✅ Yes |
| **TypeScript** | 4.5.0 | **5.1.0** | ⚠️ Minor |
| **React** | 18.2.0 | **19.2.0** | ✅ Yes |
| **Next.js** | 15.x | **16.x** | ✅ Yes |

### Check Versions

```bash
# Node.js
node --version  # Must be >= 20.9.0

# Package versions
npm list next react react-dom typescript
```

### Update Commands

```bash
# Update Node.js
nvm install 20.9.0
nvm use 20.9.0

# Update packages
npm install next@latest react@latest react-dom@latest
npm install --save-dev typescript@latest @types/react@latest @types/node@latest
```

---

## Behavior Changes (Non-Breaking)

### Default Changes

| Feature | Old Default | New Default | Override |
|---------|------------|-------------|----------|
| **Bundler** | Webpack | Turbopack | `--webpack` flag |
| **images.minimumCacheTTL** | 60s | 14400s (4h) | Config option |
| **images.imageSizes** | Includes 16 | Excludes 16 | Config option |
| **images.qualities** | [1-100] | [75] | Config option |
| **images.maximumRedirects** | Unlimited | 3 | Config option |
| **ESLint config** | Legacy | Flat config | Config option |

### Prefetch Cache Behavior

**Old:** Full page prefetch for each link
**New:** Layout deduplication + incremental prefetching

**Impact:**
- ✅ Much lower transfer sizes (50+ links = 1 layout download)
- ⚠️ More individual requests (but smaller total size)
- ✅ Automatic cancellation when link leaves viewport
- ✅ Re-prefetch on invalidation

---

## Detection Script for All Rules

```bash
#!/bin/bash
# detect-nextjs16-violations.sh

echo "🔍 Scanning for Next.js 16 violations..."
echo ""

echo "Rule 1: Async params"
rg "params\." app --type tsx -B 2 | grep -v "await params" | head -5

echo ""
echo "Rule 2: Async searchParams"
rg "searchParams\." app --type tsx -B 2 | grep -v "await searchParams" | head -5

echo ""
echo "Rule 3: Async cookies()"
rg "cookies\(\)" --type ts -B 1 | grep -v "await" | head -5

echo ""
echo "Rule 4: Async headers()"
rg "headers\(\)" --type ts -B 1 | grep -v "await" | head -5

echo ""
echo "Rule 6: revalidateTag cache profile"
rg "revalidateTag\(['\"][\w-]+['\"]\)(?!\s*,)" --type ts | head -5

echo ""
echo "Rule 8: middleware.ts exists"
ls -la middleware.ts 2>/dev/null || echo "✅ No middleware.ts found"

echo ""
echo "Rule 9: Parallel routes missing default.tsx"
for dir in $(find app -type d -name "@*"); do
  if [ ! -f "$dir/default.tsx" ]; then
    echo "❌ Missing: $dir/default.tsx"
  fi
done

echo ""
echo "Rule 10: Supabase createClient"
rg "createClient\(\)" --type ts -B 2 | grep -v "await createClient" | head -5

echo ""
echo "✅ Scan complete"
```

**Usage:**
```bash
chmod +x detect-nextjs16-violations.sh
./detect-nextjs16-violations.sh
```

---

## Common Patterns by Feature

### Server Components

```tsx
// ❌ Old Way
export default function Page({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const data = await supabase.from('table').select()
  return <div>{data}</div>
}

// ✅ New Way
export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('table').select()
  return <div>{data}</div>
}
```

### Server Actions

```ts
// ❌ Old Way
'use server'

export async function updateData() {
  const supabase = createClient()
  await supabase.from('table').update({})
  revalidateTag('data')
}

// ✅ New Way
'use server'

export async function updateData() {
  const supabase = await createClient()
  await supabase.from('table').update({})

  // Use updateTag for immediate refresh
  updateTag('data')

  // Or revalidateTag with profile for SWR
  revalidateTag('data', 'max')
}
```

### Route Handlers

```ts
// app/api/data/route.ts

// ❌ Old Way
export async function GET(request: Request) {
  const supabase = createClient()
  const { data } = await supabase.from('table').select()
  return Response.json(data)
}

// ✅ New Way
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data } = await supabase.from('table').select()
  return Response.json(data)
}
```

---

## Quick Verification Checklist

After updating code, verify compliance:

```bash
# 1. TypeScript check (must pass)
npm run typecheck

# 2. Build check (must succeed)
npm run build

# 3. Test dev server
npm run dev

# 4. Run detection script
./detect-nextjs16-violations.sh
```

**Zero violations = Next.js 16 compliant** ✅

---

**Last Updated:** 2025-10-26
**Next.js Version:** 16.0.0
**React Version:** 19.2.0
**Document Type:** Reusable Reference

**Related Documentation:**
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [ENORAE Architecture Patterns](./stack-patterns/architecture-patterns.md)
- [ENORAE Supabase Patterns](./stack-patterns/supabase-patterns.md)
